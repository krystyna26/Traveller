import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne, tripOne, tripTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { publishedTrips, myTrips, updateTrip, createTrip, deleteTrip } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('should show only published trips', async ()=> {
  const response = await client.query({query: publishedTrips})
  expect(response.data.trips.length).toBe(1)
  expect(response.data.trips[0].published).toBe(true)
})

test('should fetch users trips', async() => {
  const client = getClient(userOne.jwt)
  const { data } = await client.query({ query: myTrips })
  expect(data.myTrips.length).toBe(2)
  expect(data.myTrips.published).toBe(userOne.output.published)
})

test('should be able to update own trip' , async()=> {
  // authentication
    const client = getClient(userOne.jwt)

    const variables = {
      id: tripOne.tripOutput.id,
      data:{
        published: false
      }
    }

    const { data } = await client.mutate({ mutation: updateTrip, variables})
    const exists = await prisma.exists.Trip({ id: tripOne.tripOutput.id, published: false})

    expect(data.updateTrip.published).toBe(false)
    expect(exists).toBe(true)
})

test('should create a new trip', async ()=>{
  const client = getClient(userOne.jwt);

  const variables = {
    data: {
      traveled_from: "San Jose",
      traveled_to: "San Diego",
      travel_started_at:"2019-10-10",
      travel_ended_at:"2019-10-10",
      published: true,
      pace: 'SLOW',
    }
  }

  const { data } = await client.mutate({ mutation: createTrip})

  expect(data.createTrip.traveled_from).toBe('San Jose')
  expect(data.createTrip.travel_started_at).tobe("2019-10-10")
  expect(data.createTrip.published).toBe(true)

})

test('should delete trip', async ()=>{
  const client = getClient(userOne.jwt)
  const variables = {
    id: tripTwo.tripTwoOutput.id
  }

  await client.mutate({ mutation: deleteTrip, variables})
  const exists = await prisma.exists.Trip({ id: tripTwo.tripTwoOutput.id })

  expect(exists).toBe(false)
})
