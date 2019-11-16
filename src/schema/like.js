import { gql } from "apollo-server-lambda";

export default gql`
  extend type Mutation {
    addLike(post_id: String!): Like
    removeLike(post_id: String!): Like
  }

  type Like {
    id: ID!
    user: String
  }
`;
