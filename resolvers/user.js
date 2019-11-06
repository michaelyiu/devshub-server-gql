import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import { createToken } from "../connectors/jwt";
import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./authorization";

const validateRegisterInput = require("./../validation/register");

export default {
  Query: {
    hello: () => {
      return "Hello";
    },
    users: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, me }, info) => {
        // auth check for every query and mutation except for the signup mutation
        return models.User.find({});
      }
    ),
    user: combineResolvers(
      isAuthenticated,
      async (parent, { email }, { models, me }, info) => {
        // auth check for every query and mutation except for the signup mutation
        console.log("test")
        return models.User.findOne({ email });
      }
    )
  },
  Mutation: {
    signUp: async (parent, args, { models }, info) => {
      const { errors, isValid } = validateRegisterInput(args);

      const { email, password, name } = args;
      const hashedPassword = await bcrypt.hash(password, 10);
      const checkIfExists = await models.User.findOne({ email }).then();


      if (checkIfExists) throw new Error("User with that email already exists");
      else {
        const avatar = gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });
        const newUser = models.User.create({
          // id,
          email,
          password: hashedPassword,
          avatar,
          name
        });
        return newUser;
      }

    },

    signIn: async (parent, args, { models, secret, me }, info) => {
      const { email, password } = args;
      const user = await models.User.findOne({ email });
      const token = await createToken(user, secret);

      return {

        email: user.email,
        token
      };
    }
  }
};
