import 'cross-fetch/polyfill'

import seedDatabase, { userOne, commentOne, commentTwo, tripOne } from './utils/seedDatabase';
import { deleteComment, subscribeToComments, subscribeToTrip } from './utils/operations'

import getClient from './utils/getClient'
import prisma from '../src.prisma';

const client = getClint()

beforeEach(seedDatabase)

test("should delete own comment", async ()=>{
  const client = getClint(userOne.jwt)
  const variables = {
    id: commentTwo.comment.id
  }
  await client.mutate({ mutation: deleteComment, variables})
  const exists = await prisma.exists.Comment({ id: commentTwo.comment.id})

  expect(exists).toBe(false)
})

test("should not delte other user comment", async()=>{
  const client = getClint(userOne.jwt)
  const variables = {
    id: commentOne.comment.id
  }

  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow()
})

test("should subscribe to comments for a trip", async (done) => {
  const variables = {
    tripId: tripOne.tripOutput.id
  };
  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    // next() runs only when we mutate something
    next(response) {
      //fire up each time when comment is changed
      expect(response.data.comment.mutation).toBe('DELETED')
      done()
    }
  })
  // change a comment
    await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id }})
})

test("should subscribe to changes for published trips", async (done) => {
  client.subscribe({ query: subscribeToTrip }).subscribe({
    next(response){
      expect(response.data.trip.mutation).toBe('DELETED')
      done()
    }
  })
  await prisma.mutation.deleteTrip({ where: { id: tripOne.tripOutput.id } })
})
