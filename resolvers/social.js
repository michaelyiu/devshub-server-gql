import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, hasProfile } from "./authorization";

export default {
  Mutation: {
    updateSocials: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        const updatedProfile = await models.Profile.findOneAndUpdate(
          { user_id: me.id },
          {
            social: args
          }
        ).then(profile => {
          return profile;
        });
        return updatedProfile.social;
      }
    )
  }
};
