import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    post(id: ID!): Post
    posts: [Post]
  }

  extend type Mutation {
    createPost(
      text: String!
      name: String
      handle: String
      avatar: String
    ): Post

    deletePost(id: ID!): Boolean
  }

  type Post {
    id: ID!
    text: String!
    name: String
    handle: String
    avatar: String
    likes: [Like]
    comments: [Comment]
    user: String
  }
`;
