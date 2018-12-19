const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeAnEmail } = require('../mail');
const { hasPermission } = require('../utils');
const stripe = require('../stripe');

const Mutations = {
  async createItem(parent, args, ctx, info){
    //check if they're logged in
    if(!ctx.request.userId){
      throw new Error('You must be logged in to do that!')
    }

    const item = await ctx.db.mutation.createItem({
      data: {
        user:{ //creates relationship between item and user through userId
          connect: {
            id: ctx.request.userId 
          },
        },
        ...args
      }
    }, info)
    
    return item
  },
  updateItem(parent, args, ctx, info){
    const updates = { ...args }; //take a copy of the updates
    delete updates.id; //remove id from the updates
    return ctx.db.mutation.updateItem({ //run the update method
      data: updates,
      where: {
        id: args.id
      }
    }, info)
  },
  async deleteItem(parent, args, ctx, info){
    const where = {id: args.id };
    //1. Find the item
    const item = await ctx.db.query.item({where}, `{ id title user { id }}`);
    //2. Check if the user owns that item or have permission
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission => ['ADMIN', 'ITEMDELETE'].includes(permission));
    if(!ownsItem && !hasPermissions){
      throw new Error('You don\'t have permission');
    }
    //3. Delete item
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info){
    //lowercase email
    args.email = args.email.toLowerCase();
    //hash user password
    const password = await bcrypt.hash(args.password, 10) //10 is SALT
    //create user in db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password: password,
          permissions: { set: ['USER']}
        },
      },
      info);
      //create JWT for user
      const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET);
      //set JWT as cookie on the response
      ctx.response.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, //1 year cookie
      });
      //return user to browser
      return user;
  },
  async signin(parent, {email, password}, ctx, info){
    //1. check if there's a user with that email
    const user = await ctx.db.query.user({ where: { email: email }});
    if(!user){
      throw new Error(`No user found with email ${email}`);
    }
    //2. check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if(!valid){
      throw new Error('Invalid password!');
    }
    //3. generate JWT
    const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET)
    //4. set cookie with token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    //5. return user
    return user;
  },
  signout(parent, args, ctx, info){
    ctx.response.clearCookie('token');
    return { message: "Goodbye old friend.."}
  },
  async requestReset(parent, args, ctx, info){
    //1. Check if user is real
    const user = await ctx.db.query.user({ where: { email: args.email }});
    if(!user){
      throw new Error(`No user found with email ${args.email}`);
    }
    //2. Set a reset token and expiry on that user
    const randomBytesPromisified  = promisify(randomBytes)
    const resetToken = (await randomBytesPromisified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; //1 hour from present time
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken: resetToken, resetTokenExpiry: resetTokenExpiry}
    });
    // console.log(res);
    //3. Email user that reset token
    const mailRes = await transport.sendMail({
      from: 'emailbot@devteam.io',
      to: user.email,
      subject: 'Your password reset token.',
      html: makeAnEmail(
      `Your password reset token is here! 
        \n\n 
      <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset</a>`)
    })

    return { message: "Thanks!"}
  },
  async resetPassword(parent, args, ctx, info){
    //1. check if passwords match
    if(args.password !== args.confirmPassword){
      throw new Error('Your passwords do not match!');
    };
    //2. check if resetToken is legit
    //3. check if token is expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });
    //4. hash the users new password
    const password = await bcrypt.hash(args.password, 10);
    //5. save new password to user, and remove resetToken field
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email},
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    //6. generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    //7. set the JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    //8. return user
    return updatedUser
  },
  async updatePermissions(parent, args, ctx, info){
      //1. check if they're logged in
      if(!ctx.request.userId){
        throw new Error('You must be logged in.')
      }
      //2. query the current user
      const currentUser = await ctx.db.query.user({
        where: {
          id: ctx.request.userId
        }
      },
      info
    )
    //3. check if they have permissions to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    //4. update permissions
    return ctx.db.mutation.updateUser({
      data: {
        permissions: {
          set: args.permissions
        }
      },
      where: {
        id: args.userId
      },
    }, 
      info
    )
  },
  async addToCart(parent, args, ctx, info){
    //login status
    const { userId } = ctx.request;
    if(!userId){
      throw new Error('You must be logged in.')
    }
    //query the users cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    })
    //check if that item is already in cart, when true increment item amount by 1
    if(existingCartItem){
      // console.log('Already in cart')
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 }
      }, info)
    }
    //if not create a new cartItem
    return ctx.db.mutation.createCartItem({
      data: {
        user: {
          connect: { id: userId }
        },
        item: {
          connect: { id: args.id }
        }
      }
    }, info)
  },
  async removeFromCart(parent, args, ctx, info){
    //find cart item
    const cartItem = await ctx.db.query.cartItem({
      where: {
        id: args.id
      }
    }, `{id, user {id}}`)
    //make sure we found item
    if(!cartItem) throw new Error('No CartItem found!')
    //make sure user owns that cart item
    if(cartItem.user.id !== ctx.request.userId){
      throw new Error('You don\'t own that cart item')
    }
    //delete cart item
    return ctx.db.mutation.deleteCartItem({
      where: {
        id: args.id
      }
    }, info)
  },
  async createOrder(parent, args, ctx, info){
    //query the user-- make sure they're logged in
    const { userId } = ctx.request;
    if(!userId) throw new Error('You must be signed in to complete this order!')  
    const user = await ctx.db.query.user(
      { where: { id: userId }},
      `{id name email cart{
          id
          quantity
          item { title price id description image largeImage}
        }
      }`
    );
    //recalculate total price
    const amount = user.cart.reduce((tally, cartItem) => tally + cartItem.item.price * cartItem.quantity, 0);
    console.log(`Charging ${amount}`)
    //create stripe charge
    const charge = await stripe.charges.create({
      amount: amount,
      currency: 'USD',
      source: args.token
    })
    //convert the CartItems to OrderItems
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect : {id: userId }}
      };
      delete orderItem.id;
      return orderItem
    })
    //create the order
    const order = await ctx.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: userId }}
      }
    })
    //clean up- users cart, delete cartItems
    const cartItemIds = user.cart.map(cartItem => cartItem.id);
    await ctx.db.mutation.deleteManyCartItems({
      where: {
        id_in: cartItemIds
      }
    })
    //return the order to the client
    return order;
  }
};
  
module.exports = Mutations;