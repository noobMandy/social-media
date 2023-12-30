import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { HttpLink } from '@apollo/client';


const link = new HttpLink({
  uri: "http://localhost:5000"
  // Additional options
});

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link:authLink.concat(link) , 
  cache: new InMemoryCache(),
});


export default client;


