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
  }
};
  
module.exports = Mutations;