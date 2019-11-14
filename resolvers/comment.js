import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, hasProfile } from "./authorization";

export default {
  // Query: {
  //   comments: combineResolvers(
  //     isAuthenticated,
  //     async (parent, args, { me, models }, info) => {
  //       const post = await models.Post.findById(args.post_id);
  //       return;
  //     }
  //   )
  // },
  Mutation: {
    createComment: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        const post = await models.Post.findById(args.post_id);

        const newComment = {
          text: args.text,
          name: args.name,
          avatar: args.avatar,
          user: me.id
        };

        await models.Profile.findOne({ user: me.id }).then(profile => {
          newComment.handle = profile.handle;
          post.comments.unshift(newComment);
          post.save();
        });

        return newComment;
      }
    ),
    deleteComment: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        const post = await models.Post.findById(args.post_id);

        if (
          post.comments.filter(
            comment => comment._id.toString() === args.comment_id
          ).length === 0
        ) {
          return new Error("Comment does not exist");
        }
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(args.comment_id);

        post.comments.splice(removeIndex, 1);
        post.save().then(post);

        return true;
      }
    )
  }
};
