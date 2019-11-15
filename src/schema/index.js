import { gql } from "apollo-server-express";
import userSchema from "./user";
import postSchema from "./post";
import profileSchema from "./profile";
import socialSchema from "./social";
import experienceSchema from "./experience";
import educationSchema from "./education";
import commentSchema from "./comment";
import likeSchema from "./like";

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;
//schema stitch
export default [
  linkSchema,
  userSchema,
  postSchema,
  profileSchema,
  commentSchema,
  educationSchema,
  experienceSchema,
  socialSchema,
  likeSchema
];
