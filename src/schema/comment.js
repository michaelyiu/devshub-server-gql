import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    # ALL comments for ONE post, no need to show ALL comments for ALL posts
    comments(post_id: String!): [Comment]
  }
  extend type Mutation {
    createComment(
      post_id: String!
      text: String!
      name: String
      handle: String
      avatar: String
    ): Comment

    deleteComment(post_id: String!, comment_id: String!): Boolean
  }

  type Comment {
    id: ID!
    text: String!
    name: String
    handle: String
    avatar: String
    date: String
    user: String
  }
`;
