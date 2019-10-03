import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    profile(email: String): Profile
    profiles: [Profile]
  }

  extend type Mutation {
    updateProfile(
      handle: String!
      company: String
      website: String
      location: String
      status: String
      bio: String
      githubUsername: String
    ): Profile
  }

  type Profile {
    user: User!
    handle: String!
    company: String
    website: String
    location: String
    status: String!
    skills: [String]
    bio: String
    githubUsername: String
    experience: [Experience]
    education: [Education]
    social: Social
  }
`;
