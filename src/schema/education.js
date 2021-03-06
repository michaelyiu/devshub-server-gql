import { gql } from "apollo-server-lambda";

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

    deleteEducation(id: ID!): ID
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
