import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, hasPost } from "./authorization";

export default {
  Query: {
    posts: async (parent, args, { models }, info) => {
      // 1. getPosts
      // 2. getUser of each post
      return models.Post.find().sort({ date: -1 });
    },
    post: async (parent, args, { models }, info) => {
      const post = models.Post.findById(args.id);
      return post;
    }
  },
  Mutation: {
    createPost: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        const { text, name, avatar, user, handle } = args;

        const profile = await models.Profile.findOne({ user_id: me.id });

        const newPost = await models.Post.create({
          text,
          name,
          avatar,
          user: me.id,
          handle: profile.handle
        });
        return newPost;
      }
    ),

    deletePost: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        const post = await models.Post.findById(args.id);
        if (post.user.toString() !== me.id) {
          throw new Error("User not authorized");
        }

        post
          .remove()
          .then(post)
          .catch(err => {
            throw new Error("Post not found");
          });

        return true;
      }
    )
    // editPost: async (parent, args, ctx, info) => {},
    // deletePost: async (parent, args, ctx, info) => {}
  }
};
