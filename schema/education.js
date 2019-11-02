import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    education: Education
  }

  extend type Mutation {
    createEducation(
      school: String!
      degree: String!
      fieldOfStudy: String!
      from: String!
      to: String
      current: Boolean
      description: String
    ): Education

    editEducation(
      id: ID!
      school: String!
      degree: String!
      fieldOfStudy: String!
      from: String!
      to: String
      current: Boolean
      description: String
    ): Education

    deleteEducation(id: ID!): Boolean
  }

  type Education {
    id: ID!
    school: String!
    degree: String!
    fieldOfStudy: String!
    from: String!
    to: String
    current: Boolean
    description: String
  }
`;
