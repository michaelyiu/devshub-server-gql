import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    experience: Experience
  }

  extend type Mutation {
    createExperience(
      title: String!
      company: String!
      location: String
      from: String!
      to: String
      current: Boolean
      description: String
    ): Experience

    editExperience(
      id: ID!
      title: String!
      company: String!
      location: String
      from: String!
      to: String
      current: Boolean
      description: String
    ): Experience

    deleteExperience(id: ID!): ID
  }

  type Experience {
    id: ID!
    title: String!
    company: String!
    location: String
    from: String!
    to: String
    current: Boolean
    description: String
  }
`;
