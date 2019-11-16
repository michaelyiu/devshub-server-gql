import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import { createToken } from "../connectors/jwt";
import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated } from "./authorization";
import { AuthenticationError, UserInputError } from "apollo-server-core";

const validateRegisterInput = require("./../validation/register");
const validateLoginInput = require('./../validation/login');

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
        return models.User.findOne({ email });
      }
    )
  },
  Mutation: {
    signUp: async (parent, args, { models }, info) => {
      const { errors, isValid } = validateRegisterInput(args);
      if (!isValid) {
        throw new UserInputError("Login failed!", { errors });
      }

      const { email, password, name } = args;
      const hashedPassword = await bcrypt.hash(password, 10);
      const checkIfExists = await models.User.findOne({ email }).then();

      if (checkIfExists) {
        errors.email = "User with that email already exists"
        throw new UserInputError("Sign up failed!", { errors });
      }
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
      const { errors, isValid } = validateLoginInput(args);
      if (!isValid) {
        throw new UserInputError("Login failed!", { errors });
      }

      const { email } = args;
      const user = await models.User.findOne({ email }).then(async user => {
        if (!user) {
          errors.email = "User not found";
          throw new UserInputError("Login failed!", { errors });
        }

        const passwordIsValid = await bcrypt.compare(args.password, user.password);

        if (!passwordIsValid) {
          throw new AuthenticationError("Invalid login/password!")
        }

        return user;
      });
      const token = await createToken(user, secret);
      return {
        email: user.email,
        token
      };
    }
  },
  User: {
    profile: async (user, args, { models }) => {
      return await models.Profile.findOne({ user: user.id })
    }
  }
};
