import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, hasProfile } from "./authorization";

const validateProfileInput = require('./../validation/profile');

export default {
  Mutation: {
    updateSocials: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        const { errors, isValid } = validateProfileInput(args);

        if (!isValid) {
          throw new UserInputError("Some required fields should not be empty!", { errors })
        }

        const updatedProfile = await models.Profile.findOneAndUpdate(
          { user: me.id },
          { $set: { social: args } },
          { new: true }

        ).then(profile => profile);
        return updatedProfile.social;
      }
    )
  }
};
