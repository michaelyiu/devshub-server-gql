import { gql } from "apollo-server-express";

export default gql`
  extend type Mutation {
    addLike(post_id: String!): Boolean
    removeLike(post_id: String!): Boolean
  }

  type Like {
    id: ID!
    user: String
  }
`;
