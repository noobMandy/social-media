import React, { useContext, useState } from "react";
import { GET_POSTS } from "../graphql/getPosts";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";
import { Button, Icon, Input } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useQuery(GET_POSTS);
  const [likePost] = useMutation(LIKE_POST_MUTATION); // Replace with the actual mutation
  const [addComment] = useMutation(ADD_COMMENT_MUTATION);
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION);

  const [deletePost] = useMutation(DELETE_POST_MUTATION);

  const [likedPosts, setLikedPosts] = useState([]);
  const [commentText, setCommentText] = useState("");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleLike = async (postId) => {
    try {
      await likePost({ variables: { postId } });
      setLikedPosts([...likedPosts, postId]);
    } catch (err) {
      console.error("Error liking post:", err.message);
    }
  };

  const handleAddComment = async (postId, body) => {
    try {
      await addComment({ variables: { postId, body } });
      setCommentText("");

      console.log("After setting commentText:", commentText);
    } catch (err) {
      console.error("Error adding comment:", err.message);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment({ variables: { postId, commentId } });
      // Optionally, you can refetch the post data here to update the comments immediately
    } catch (err) {
      console.error("Error deleting comment:", err.message);
    }
  };


  const handleDeletePost = async (postId) => {
    try {
      await deletePost({ variables: { postId } });
      // Optionally, you can refetch the post data here to update the posts immediately
    } catch (err) {
      console.error("Error deleting post:", err.message);
    }
  };
  const posts = data.getPosts;

  return (
    <div>
      <h2>Recent Posts</h2>
      {user && (
        <div>
          {" "}
          <PostForm />
        </div>
      )}
      <div className="ui stackable three column grid">
        {posts.map((post) => (
          <div className="column" key={post.id}>
            <div className="ui card">
              <div className="content">
                <div className="right floated meta">
                  Posted{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(new Date(post.createdAt))}
                </div>
                <img
                  className="ui avatar image"
                  src="https://semantic-ui.com/images/avatar2/large/matthew.png"
                  alt={post.username}
                />{" "}
                {post.username}
              </div>
              <div className="content">{post.body}</div>
              <div className="extra content">
                <span className="right floated">
                  <i
                    className="heart outline like icon"
                    onClick={() => handleLike(post.id)}
                    disabled={likedPosts.includes(post.id)}
                  ></i>
                  {post.likeCount} likes
                </span>
                <i className="comment icon"></i>
                {post.commentCount} comments
                {/* Add comment input field */}
                {user && (
                  <div>
                    <Input
                      type="text"
                      value={commentText}
                      placeholder="Add a comment..."
                      style={{ marginBottom: "5px" }}
                      // ref={commentInputRef}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button
                      color="teal"
                      onClick={() => handleAddComment(post.id, commentText)}
                    >
                      Add Comment
                    </Button>
                  </div>
                )}
                {/* Display existing comments */}
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div style={{ marginRight: "10px" }}>
                      <span>
                        <strong>{comment.username}</strong>
                      </span>
                      :<p>{comment.body}</p>
                    </div>
                    {user && user.username === comment.username && (
                      <Icon
                        name="trash"
                        onClick={() => handleDeleteComment(post.id, comment.id)}
                        style={{ cursor: "pointer" }}
                      ></Icon>
                    )}
                  </div>
                ))}
              </div>
              {user && user.username === post.username && (
                <Button  onClick={() => handleDeletePost(post.id)}>
                  <Icon name="trash" style={{ margin: 0 }} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;
const ADD_COMMENT_MUTATION = gql`
  mutation createComment($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default Home;
