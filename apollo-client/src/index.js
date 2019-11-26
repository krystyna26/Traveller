import ApolloBoost, { gql } from 'apollo-boost';
import ReactDOM from 'react-dom';
import App from './App';

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

// ReactDOM.render(<App />, document.getElementById('root'))

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

// ReactDOM.render(<App />, document.getElementById('root'))
// --------------------
  // const domContainer = document.querySelector('#trips');
  // ReactDOM.render(class, domContainer)


// 'use strict';
//
// const e = React.createElement;
//
// class LikeButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { liked: false };
//   }
//
//   render() {
//     if (this.state.liked) {
//       return 'You liked this.';
//     }
//
//     return e(
//       'button',
//       { onClick: () => this.setState({ liked: true }) },
//       'Like'
//     );
//   }
// }
//
// const domContainer = document.querySelector('#trips');
// ReactDOM.render(e(LikeButton), domContainer);
