import ApolloBoost, { gql } from 'apollo-boost';

const client = new ApolloBoost({
  // graphql backend uri
  uri: 'http://localhost:4000'
})

const getUsers = gql`
  query {
    users {
      id
      first_name
    }
  }
`

// query should look similar to one from localhost:4000
client.query({ query: getUsers }).then((response) => {
  let html  = ''
  console.log(response.data.users)

  response.data.users.forEach((user) => {
    html += `
      <div>
        <h3>${user.first_name}</h3>
      </div>
    `
  })

  document.getElementById('users').innerHTML = html
})


const getTrips =  gql`
  query{
    trips {
      traveled_from
      traveled_to
      published
      author {
        id
        first_name
      }
    }
  }
`;

client.query({ query: getTrips }).then((response) => {
  // console.log(response.data)
  let html = '';

  response.data.trips.forEach(trip=>{
    html += `
      <div>
        <h3>${trip.author.first_name}</h3>
      </div>
    `
  })
// trips id is in index.html file
  document.getElementById('trips').innerHTML = html
})
