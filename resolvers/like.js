import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, hasProfile } from "./authorization";

export default {
  Mutation: {
    addLike: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        args.user_id = me._id;
        const post = await models.Post.findById(args.post_id);
        //if the user has not liked the post, then add the like
        if (
          post.likes.filter(like => like.user.toString() === me._id).length > 0
        ) {
          throw new Error("User already liked this post");
        }
        post.likes.unshift({ user: me._id });
        post.save().then(post);
        return true;
      }
    ),
    removeLike: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        const post = await models.Post.findById(args.post_id);

        if (
          post.likes.filter(like => like.user.toString() === me._id).length === 0
        ) {
          throw new Error("You haven't liked this post yet");
        }

        // Get remove index
        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(me._id);

        post.likes.splice(removeIndex, 1);

        post.save().then(post);
        return true;
      }
    )
  }
};
