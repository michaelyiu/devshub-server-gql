import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, hasExperience } from "./authorization";

export default {
  Mutation: {
    createExperience: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        args.user_id = me.id;
        const expAdd = {
          title: args.title,
          company: args.company,
          location: args.location,
          from: args.from,
          to: args.to,
          current: args.current,
          description: args.description
        };

        const newExp = await models.Profile.findOne({ user: require('mongodb').ObjectID(me.id) }).then(profile => {
          profile.experience.unshift(expAdd);
          profile.save();
          return profile.experience[0];
        });
        return newExp;
      }
    ),

    editExperience: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        args.user_id = me.id;

        const expFields = {};
        if (args.title || args.title === "") expFields.title = args.title;
        if (args.company || args.company === "")
          expFields.company = args.company;
        if (args.location || args.location === "")
          expFields.location = args.location;
        if (args.from || args.from === "") expFields.from = args.from;
        if (args.to || args.to === "") expFields.to = args.to;
        expFields.current = args.current;
        if (args.description || args.description === "")
          expFields.description = args.description;

        const profile = await models.Profile.findOne({ user: require('mongodb').ObjectID(me.id) });
        const index = profile.experience.map(item => item.id).indexOf(args.id);

        const newProfile = await models.Profile.findOneAndUpdate(
          { user: require('mongodb').ObjectID(me.id) },
          { $set: { [`experience.${index}`]: expFields } },
          { new: true }
        )
          .then(profile => {
            return profile;
          })
          .catch(err => {
            throw new Error(err);
          });

        return newProfile.experience[index];
      }
    ),
    deleteExperience: combineResolvers(
      isAuthenticated,

      async (parent, args, { me, models }, info) => {
        args.user_id = me.id;

        models.Profile.findOne({ user: require('mongodb').ObjectID(me.id) })
          .then(profile => {
            const removeIndex = profile.experience
              .map(item => item.id)
              .indexOf(args.id);

            profile.experience.splice(removeIndex, 1);

            profile.save().then(profile => {
              return profile;
            });
          })
          .catch(err => {
            throw new Error(err);
          });
        return args.id;
      }
    )
  }
};
