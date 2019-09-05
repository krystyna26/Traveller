import { GraphQLServer, PubSub } from 'graphql-yoga';
// import { resolvers, fragmentReplacements } from './resolvers/index';
// import prisma from './prisma';
import db from './db';
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";
import Trip from "./resolvers/Trip";
import Photos from "./resolvers/Photos";
import Stop from "./resolvers/Stop";
import Subscription from "./resolvers/Subscription";

const pubsub = new PubSub();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    User,
    Comment,
    Trip,
    Photos,
    Stop,
    Subscription
  },
  context:{
    db,
    pubsub
  }
  // context(request) {
    // return {
  //     pubsub,
  //     prisma,
  //     request
  // db
    // }
  // },
  // fragmentReplacements
});

server.start(()=> {
  console.log("Server is up")
  // run: npm run start
  // check localhost:4000
})
