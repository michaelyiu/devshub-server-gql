import { GraphQLDateTime } from "graphql-iso-date";

import userResolvers from "./user";
import postResolvers from "./post";
import profileResolvers from "./profile";
import educationResolvers from "./education";
import experienceResolvers from "./experience";
import socialResolvers from "./social";
import commentResolvers from "./comment";
import likeResolvers from "./like";

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  postResolvers,
  profileResolvers,
  educationResolvers,
  experienceResolvers,
  socialResolvers,
  commentResolvers,
  likeResolvers
];
