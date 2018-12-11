const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeAnEmail } = require('../mail');

const Mutations = {
  async createItem(parent, args, ctx, info){
    //TODO: check if theyre logged in

    const item = await ctx.db.mutation.createItem({
      data: {
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
    const item = await ctx.db.query.item({where}, `{ id title}`);
    //2. Check if the user owns that item or have permission
    // TODO
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
  }
};
  
module.exports = Mutations;