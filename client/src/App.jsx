import { //import apollo.
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import './App.css';

import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

const httpLink = createHttpLink({
  uri: '/graphql',
});

//Make the middleware that'll attach the token to each request sent.
const authLink = setContext((_, { headers }) => {
  //if we have it in local storage, get it.
  const token = localStorage.getItem('id_token');
  //return the headers so they can be read.
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  //Execute the Authentication middleware first before going anywhere else.
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(), //create a cache too.
});

function App() { //now we can wrap everything in an Apollo header.
  return (
    <ApolloProvider client={client}>
      <>
        <Navbar />
        <Outlet />
      </>
    </ApolloProvider>
  );
}

export default App;