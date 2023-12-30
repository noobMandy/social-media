import { Button, Form } from "semantic-ui-react";
import { gql } from "graphql-tag";
import { useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";
import { GET_POSTS } from "../graphql/getPosts";

function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      try {
        const data = proxy.readQuery({
          query: GET_POSTS,
        });

        const newData = JSON.parse(JSON.stringify(data));

        newData.getPosts = [result.data.createPost, ...newData.getPosts];

        proxy.writeQuery({ query: GET_POSTS, data: newData });
        values.body = "";
      } catch (e) {
        console.error("Error updating cache:", e);
      }
    },
  });

  function createPostCallback() {
    createPost();
  }
  const isButtonDisabled = values.body.trim() === "";
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal" style={{marginBottom
          :"10px"}}        disabled={isButtonDisabled} >
            Create
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors.message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
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

export default PostForm;
