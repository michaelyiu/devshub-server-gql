import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, hasEducation } from "./authorization";

export default {
  Query: {},
  Mutation: {
    createEducation: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        args.user_id = me.id;
        const newEdu = {
          school: args.school,
          degree: args.degree,
          fieldOfStudy: args.fieldOfStudy,
          from: args.from,
          to: args.to,
          current: args.current,
          description: args.description
        };

        models.Profile.findOne({ user_id: me.id }).then(profile => {
          profile.education.unshift(newEdu);
          profile.save();
        });

        return newEdu;
      }
    ),

    editEducation: combineResolvers(
      isAuthenticated,
      async (parent, args, { me, models }, info) => {
        args.user_id = me.id;

        const eduFields = {};
        if (args.school || args.school === "") eduFields.school = args.school;
        if (args.degree || args.degree === "") eduFields.degree = args.degree;
        if (args.fieldOfStudy || args.fieldOfStudy === "")
          eduFields.fieldOfStudy = args.fieldOfStudy;
        if (args.from || args.from === "") eduFields.from = args.from;
        if (args.to || args.to === "") eduFields.to = args.to;
        eduFields.current = args.current;
        if (args.description || args.description === "")
          eduFields.description = args.description;

        const profile = await models.Profile.findOne({ user_id: me.id });
        const index = profile.education.map(item => item.id).indexOf(args.id);

        const newProfile = await models.Profile.findOneAndUpdate(
          { user_id: me.id },
          { $set: { [`education.${index}`]: eduFields } },
          { new: true }
        )
          .then(profile => {
            return profile;
          })
          .catch(err => {
            throw new Error(err);
          });

        return newProfile.education[index];
      }
    ),
    deleteEducation: combineResolvers(
      isAuthenticated,

      async (parent, args, { me, models }, info) => {
        args.user_id = me.id;

        models.Profile.findOne({ user_id: me.id })
          .then(profile => {
            const removeIndex = profile.education
              .map(item => item.id)
              .indexOf(args.id);

            profile.education.splice(removeIndex, 1);

            profile.save().then(profile => {
              return profile;
            });
            console.log(profile.education);
          })
          .catch(err => {
            throw new Error(err);
          });
        return true;
      }
    )
  }
};
