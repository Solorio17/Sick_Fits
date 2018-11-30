const Mutations = {
    async createItem(parent, args, ctx, info){
        //TODO: check if theyre logged in
  
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args //same as habing to do title: args.title ...
            }
        }, info);
        return item
    }
  };
  
  module.exports = Mutations;