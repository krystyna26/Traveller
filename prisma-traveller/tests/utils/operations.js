import {gql } from 'apollo-boost'

const createUser = gql`
    mutation($data: CreateUserInput!) {
      createUser(
        data: $data
      ){
        token,
        user {
          id
          first_name
          last_name
          email
          password
        }
      }
    }
  `
  const getUsers = gql`
    query {
      users {
        id
        first_name
        last_name
        email
        password
      }
    }
  `

  const login = gql`
    mutation($data: LoginUserInput!) {
      login (
        data: $data
      ){
        token
      }
    }
  `

  const getProfile = gql`
    query {
      me{
        id
        first_name
        last_name
        password
        email
      }
    }
  `

  const publishedTrips = gql`
    query {
      trips {
        id
        traveled_from
        traveled_to
        published
        pace

      }
    }
  `

  const myTrips = gql`
    query {
      myTrips {
        id
        traveled_from
        traveled_to
        published
      }
    }
  `

  const updateTrip =  gql`
    mutation($id: ID!, $data: UpdateTripInput!) {
      updateTrip(
        id: $id
        data: $data
      ){
        id
        traveled_from
        traveled_to
        travel_started_at
        travel_ended_at
        published
        pace
      }
    }
  `


    const createTrip = gql`
      mutation($data: CreateTripInput!) {
        createTrip(
          data: $data
        ){
          id
          traveled_from
          traveled_to
          travel_started_at
          travel_ended_at
          published
          pace
        }
      }
    `

    const deleteTrip = gql`
      mutation($id: ID!) {
        deleteTrip(
          id: $id
        ){
          id
        }
      }
    `

    const deleteComment = gql`
      mutation($id: ID!) {
        deleteComment(
          id: $id
        ){
          id
        }
      }
    `

  const subscribeToComments = gql`
    subscription($postId: ID!){
      mutation
      node{
        id
        content
      }
    }
  `

  const subscribeToTrip = gql`
    subscription {
      trip {
        mutation
      }
    }
  `

export { createUser, login, getUsers, getProfile, publishedTrips, myTrips, updateTrip, createTrip, deleteTrip, deleteComment, subscribeToComments, subscribeToTrip }
