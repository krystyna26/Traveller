import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import { Query } from "react-apollo";
import ApolloBoost, { gql } from 'apollo-boost'
// import getUser from './getUser.graphql'

const GET_USERS = gql`
  query {
    users {
        id
        name
    }
  }
`

function App() {
  return (
    <Query query={GET_USERS}>
      {({loading, data, error}) => {
        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;

        return (
          <div>
          <p>Hello everyone</p>
          </div>
        )
      }}
    </Query>
  );
}

export default App;
