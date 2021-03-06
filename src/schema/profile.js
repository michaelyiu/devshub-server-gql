import { gql } from "apollo-server-lambda";

export default gql`
  extend type Query {
    profile(email: String): Profile
    profiles: [Profile]
    profileByHandle(handle: String!): Profile
  }

  extend type Mutation {
    updateProfile(
      handle: String!
      company: String
      website: String
      location: String
      status: String
      skills: String!
      bio: String
      githubUsername: String
    ): Profile

    deleteProfile: Boolean
  }

  type Profile {
    user: User!
    handle: String!
    company: String
    website: String
    location: String
    status: String
    skills: [String]!
    bio: String
    githubUsername: String
    experience: [Experience]
    education: [Education]
    social: Social
    date: Date
  }
`;
