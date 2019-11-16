import { gql } from "apollo-server-lambda";

export default gql`
  extend type Mutation {
    updateSocials(
      youtube: String
      twitter: String
      facebook: String
      linkedin: String
      instagram: String
    ): Social
  }

  type Social {
    youtube: String
    twitter: String
    facebook: String
    linkedin: String
    instagram: String
  }
`;
