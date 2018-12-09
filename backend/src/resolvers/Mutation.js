const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  }
};
  
module.exports = Mutations;