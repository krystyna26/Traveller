import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, login, getUsers, getProfile  } from './utils/operations'

const client = getClient();

beforeEach(seedDatabase);

test('Should create new user', async () => {

  const variables = {
    data: {
      first_name: "Joanna",
      last_name: "Pomana",
      email: "joanna@example.com",
      password: "testingPassword"
    }
  }

    const response = await client.mutate({
      mutation: createUser,
      variables: variables
    })

  const exists = await prisma.exists.User({id: response.data.createUser.user.id})

  expect(exists).toBe(true)
})

test('should expose public author profiles', async () => {
  const response = await client.query({query: getUsers})

  expect(response.data.users.length).toBe(2)
  expect(response.data.users[0].email).toBe(null) //i'm not logged in
  expect(response.data.users[0].first_name).toBe('ja')
})



test('should not login with bad credentials', async () => {
  const variables = {
    data:{
      email: "super@example.com",
      password: "respect123"
    }
  }
  await expect(
    client.mutate({ mutation: login, variables })
  ).rejects.toThrow()
})

test('should not sign up when password is too short', async () => {
  const variables = {
    data :{
      first_name: "Kasia",
      last_name: "Pasia",
      email: "kasia@gamil.com",
      password: "short"
    }
  }


  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow()
})

test('should fetch user profile', async () => {
  const client = getClient(userOne.jwt)

  const { data } = await client.query({ query: getProfile })

  expect(data.me.id).toBe(userOne.output.id)
  expect(data.me.first_name).toBe(userOne.output.first_name)
  expect(data.me.email).toBe(userOne.output.email)
})




// import { getFirstName, isValidPassword } from '../src/utils/user.js';
//
// test('should return first name', () => {
//   const firstName = getFirstName('Krystyna');
//   expect(firstName).toBe('Krystyna')
//
// });
//
// test('should have valid password', () => {
//   const myPassword = isValidPassword('zaqwsx');
//   expect(myPassword).toBe(false)
// });
//
// test('should reject password password', () => {
//   const containsPassword = isValidPassword('password');
//   expect(containsPassword).toBe(false)
// });
//
// test('should correclty validate password', () => {
//   const myPassword = isValidPassword('zaq12wsx');
//   expect(myPassword).toBe(true)
// })
