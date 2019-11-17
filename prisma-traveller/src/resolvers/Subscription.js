import getUserId from '../utils/getUserId';

const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info){
      let count = 0;

      setInterval(() => {
              count++;
              pubsub.publish("count", {
                count: count
              });
            }, 1000);

      // parameter here is call 'channel name'
      return pubsub.asyncIterator('count')
    }
  },

  comment: {
    // data flows: Prisma -> Node.js(GraphQL API | 4000) -> Client (GraphQL playground)
    // in 4466 we have 4 fields for subscription sent by Prisma to Node
    // in 4000 we have only 2 things sent by Node to client
    // to syncronize that go to schema.graphql and in CommentSubscriptionPayload
    // change `data: Comment!` to `node: Comment` so we can match these 2 fields (mutation and node)

    // comment added to trip if published
    subscribe(parent, { tripId }, { db, pubsub, prisma }, info){
      return prisma.subscription.comment({
        where: {
          node: {
            trip: {
              id: tripId
            }
          }
        }
      }, info)

      // ========== whithout prisma ==========
      // const trip  = db.trips.find(trip => trip.id === tripId && trip.published);
      // // console.log("trip", trip);
      // if(!trip){
      //   throw new Error("Trip not found")
      // }
      // console.log("COMMENT SUBSCRIPTION");
      // // console.log("COMMENT SUBSCRIPTION", pubsub.asyncIterator(`Comment was added to trip ${tripId}`));
      // // console.log("Subscription.comment", pubsub.asyncIterator(`trip ${tripId}`));
      // return pubsub.asyncIterator(`Comment was added to trip ${tripId}`)
    }
  },

  trip: {
    //  "Subscription field must return Async Iterable. Received: undefined"
    // lesson 36 and 37
    subscribe(parent, { userId }, { prisma }, info){
      return prisma.subscription.trip({
        where:{
          node: {
            author:{
              id: userId
            }
          }
        }
      }, info)
      // ========== whithout prisma =========
      // const authorExists = db.users.find(user => user.id === userId);
      //
      // if(!authorExists){
      //   throw new Error('User does not found');
      //
      //   return pubsub.asyncIterator(`Trip was added by user ${userId}`)
      // }
    }
  },

  myTrips: {
    subscribe(parent, args, { prisma, request }, info){
      const userId = getUserId(request);

      return prisma.subscription.trip({
        where:{
          node: {
            author: {
              id: userId
            }
          }
        }
      }, info)
    }
  },

  photo: {
    // photo added as avatar
    // photo added to the trip if published
    subscribe(parent, args, { prisma }, info){
      const opArgs = {};

      if(args.subscription){
        opArgs.where.node = {
            OR:[{
              trip: args.tripId
            },
            {
              avatarAuthor: args.userId
            }]
        }
      }
      return prisma.subscription.photo(opArgs, info)
      // ========== whithout prisma =========
      // const trip = db.trips.find(trip => trip.id === tripId && trip.published);
      // console.log("PHOTOS SUBSCRIPTION", trip, userId);
      // if(!trip){
      //   return pubsub.asyncIterator(`User ${userId} add changed its profile photo`)
      // } else {
      //   return pubsub.asyncIterator(`User ${userId} added photo(s) to thr trip`)
      // }
    }
  },

  stop: {
    // stop added to trip if published
    subscribe(parent, { tripId }, { prisma }, info){
      return prisma.subscription.stop({
        where: {
          node: {
            trip: {
              id: tripId
            }
          }
        }
      }, info)
      // ========== whithout prisma =========
    //   const trip = db.trips.find(trip => trip.id === tripId && trip.published);
    //
    //   if(!trip){
    //     throw new Error("Trip you're trying to add stop to doesn't exist.")
    //   }
    //   return pubsub.asyncIterator(`New stop added to trip ${tripId}`)
    }
  },
}

export { Subscription as default }
