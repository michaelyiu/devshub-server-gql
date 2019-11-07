import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, hasProfile } from "./authorization";

import { UserInputError } from "apollo-server-core";

const validateProfileInput = require('./../validation/profile');

export default {
  Query: {
    profile: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        return await models.Profile.findOne({ user: require('mongodb').ObjectID(me._id) });
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
        profileFields.user_id = me._id;
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

        const updatedProfile = models.Profile.findOne({ user_id: me._id })
          .then(profile => {
            if (profile) {
              models.Profile.findOneAndUpdate(
                { user_id: me._id }, { $set: profileFields }, { new: true }
              ).then(profile);
            } else {
              //Create
              console.log("profile creation hit")

              //Check if handle exists
              models.Profile.findOne({ handle: profileFields.handle }).then(profile => {
                if (profile) {
                  errors.handle = "ERROR~~";
                  throw new UserInputError("Handle already exists");
                }
                //save profile
                return models.Profile(profileFields).save().then(profile)
              })
            }
            return profile;
          })
        return updatedProfile;
      }
    )
  }
};
