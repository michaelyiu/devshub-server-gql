import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, hasProfile } from "./authorization";

import { UserInputError } from "apollo-server-core";

const validateProfileInput = require('./../validation/profile');

export default {
  Query: {
    profile: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        console.log(me)
        return await models.Profile.findOne({ user: me.id });
      }
    ),
    profiles: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        return models.Profile.find({});
      }
    )
  },
  Mutation: {
    updateProfile: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        const { errors, isValid } = validateProfileInput(args);

        if (!isValid) {
          throw new UserInputError("Some required fields should not be empty!", { errors })
        }


        //Get fields
        const profileFields = {};
        profileFields.user = me._id;
        if (args.handle) profileFields.handle = args.handle;
        if (args.company || args.company === "")
          profileFields.company = args.company;
        if (args.website || args.website === "")
          profileFields.website = args.website;
        if (args.location || args.location === "")
          profileFields.location = args.location;
        if (args.bio || args.bio === "") profileFields.bio = args.bio;
        if (args.status || args.status === "")
          profileFields.status = args.status;
        if (args.githubUsername || args.githubUsername === "")
          profileFields.githubUsername = args.githubUsername;
        if (typeof args.skills !== "undefined") {
          profileFields.skills = args.skills.split(",");
        }

        const updatedProfile = models.Profile.findOne({ user: me._id })
          .then(async profile => {
            if (profile) {
              models.Profile.findOneAndUpdate(
                { user: me._id }, { $set: profileFields }, { new: true }
              ).then(profile);
            } else {
              //Create

              //Check if handle exists
              return await models.Profile.findOne({ handle: profileFields.handle }).then(async profile => {
                if (profile) {
                  errors.handle = "ERROR~~";
                  throw new UserInputError("Handle already exists");
                }
                //save profile
                return await models.Profile(profileFields).save().then(profile)
              })
            }
          })
        return updatedProfile;
      }
    )
  },
  Profile: {
    user: async (profile, args, { models }) => {
      return await models.User.findOne({ _id: profile.user })
    }
  }
};
