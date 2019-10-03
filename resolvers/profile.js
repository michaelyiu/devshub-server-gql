import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, hasProfile } from "./authorization";

export default {
  Query: {
    profile: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        // const currentUser = models.User.findOne({ email: me.email });
        return models.Profile.findOne({ user_id: me.id });
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
        args.user_id = me.id;

        //Get fields
        const profileFields = {};
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

        const profile = await models.Profile.findOne({ user_id: me.id });
        let updatedProfile;

        if (profile) {
          updatedProfile = await models.Profile.findOneAndUpdate(
            { user_id: me.id },
            { $set: profileFields },
            { new: true }
          ).then(profile => {
            return profile;
          });

          return updatedProfile;
        } else {
          const handleCheck = await models.Profile.findOne({
            handle: profileFields.handle
          });

          if (!handleCheck) {
            throw new Error("Handle already exists");
          }

          return await models.Profile.create(profileFields);
        }
      }
    )
  }
};
