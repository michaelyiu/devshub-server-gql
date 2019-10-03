import { ForbiddenError } from "apollo-server-express";
import { skip } from "graphql-resolvers";

// method to check if logged in
export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError("Not authenticated as user");
