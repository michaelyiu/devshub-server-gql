import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, hasProfile } from "./authorization";

export default {
  Mutation: {
    updateSocials: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        const updatedProfile = await models.Profile.findOneAndUpdate(
          { user: me.id },
          {
            $set: { social: args }
          },
          { new: true }

        ).then(profile => profile);
        return updatedProfile.social;
      }
    )
  }
};
