import { gql } from "graphql-tag";

export const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        username
        body
        createdAt
        id
      }
    }
  }
`;
