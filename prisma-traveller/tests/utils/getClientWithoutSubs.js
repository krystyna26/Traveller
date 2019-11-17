import ApolloBoost from 'apollo-boost';

const getClient = (jwt) => {
  // return new instance of apollo ApolloBoost
  return new ApolloBoost({
    uri: 'http://localhost:4000',
    request(operation){
      if(jwt){
        operation.setContext({
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        })
      }
    }
  })
}

export { getClient as default }
