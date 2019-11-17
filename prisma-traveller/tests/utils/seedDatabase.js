import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';
import jwt from 'jsonwebtoken';

const userOne = {
    input: {
      first_name: "ja",
      last_name: "tez ja",
      email: 'alejaja@example.com',
      password: bcrypt.hashSync('zaq12wsx')
    },
    output: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
      first_name: "Kasia",
      last_name: "tez kasia",
      email: 'kasiatest@example.com',
      password: bcrypt.hashSync('kasia')
    },
    output: undefined,
    jwt: undefined
}

const tripOne = {
  input:{
    traveled_from: "Zako",
    traveled_to: "Krakow",
    travel_started_at:"2019-10-10",
    travel_ended_at:"2019-10-10",
    published: true,
    pace: 'FAST'
  },
  //balowe final data that prisma sends back
  tripOutput: undefined
}

const tripTwo = {
  input: {
    traveled_from: "Zakopane",
    traveled_to: "Krakow",
    travel_started_at:"2019-10-10",
    travel_ended_at:"2019-10-10",
    published: false,
    pace: 'SLOW',
  },
  tripTwoOutput: undefined
}

const commentOne = {
  input: {
    trip: '123',
    content: 'String',
    published: false
  },
  comment: undefined
}

const commentTwo = {
  input: {
    trip: '123',
    content: 'String test 2',
    published: false
  },
  comment: undefined
}

const seedDatabase = async () => {
  // delete test data

  // on localhost:4466 check methods you can use to clean data, so test won't fail
  await prisma.mutation.deleteManyComments()
  await prisma.mutation.deleteManyTrips()
  await prisma.mutation.deleteManyUsers()

  // create user one
  userOne.output =  await prisma.mutation.createUser({
    data: userOne.input
  })
  userOne.jwt = jwt.sign({userId: userOne.output.id}, process.env.JWT_SECRET)

  // create user two
  userTwo.output =  await prisma.mutation.createUser({
    data: userTwo.input
  })
  userTwo.jwt = jwt.sign({userId: userTwo.output.id}, process.env.JWT_SECRET)



// create trip one
  tripOne.tripOutput = await prisma.mutation.createTrip({
    data: {
      ...tripOne.input,
      author: {
        connect: {
          id: userOne.output.id
        }
      }
    }
  })

// create trip two
  tripTwo.tripTwoOutput  = await prisma.mutation.createTrip({
    data: {
      ...tripTwo.input,
      author: {
        connect: {
          id: userOne.output.id
        }
      }
    }
  })


// create comment one
commentOne.comment = await prisma.mutation.createComment({
  data: {
    ...commentOne.input,
    author:{
      connect: {
        id: userTwo.output.id
      }
    },
    trip: {
      connect: {
        id: tripOne.tripOutput.id
      }
    }
  }
})

// create comment two
commentTwo.comment = await prisma.mutation.createComment({
  data: {
    ...commentTwo.input,
    author:{
      connect: {
        id: userOne.output.id
      }
    },
    trip: {
      connect: {
        id: tripOne.tripOutput.id
      }
    }
  }
})




}








export { seedDatabase as default, userOne, userTwo, tripOne, tripTwo, commentOne, commentTwo }
