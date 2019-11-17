import getUserId from '../utils/getUserId';

const Query = {
  users(parent, args, { prisma }, info) {
    // operational args
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy:args.orderBy,
    };

    if(args.query){
      opArgs.where = {
        // when either of these below are true - the user gets return
        OR:[{
          first_name_contains: args.query
        }, {
          email_contains: args.query
        }]
      }
    }

    // nothing, string, object - to the second arg, relational data
    return prisma.query.users(opArgs, info)


    // ========== whithout prisma ==========
    // if (!args.query) {
    //   return db.users;
    // }
    // return users.filter(user => {
    //   return user.name.toLowerCase().includes(args.query.toLowerCase());
    // });
  },

  me(parent, args, {prisma, request }, info){
    const userId = getUserId(request);

    return prisma.query.user({
      where:{
        id: userId
      }
    })
  },

  // all and only published trips
  trips(parent, args, { prisma, request }, info) {
    // const userId = getUserId(request, false);
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where:{
        published: true
      }
    };
    if(args.query){
      opArgs.where.OR = [{
        traveled_from_contains: args.query
      },{
        travel_to_contains: args.query
      }]
    }
    return prisma.query.trips(opArgs, info)
  },

  // author's trip by id
  async trip(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false);
    // Only trip owner should be able to see this trip
    const trips = await prisma.query.trips({
      where: {
        id: args.id,
        OR:[{
          published: true
        },{
          author:{
            id: userId
          }
        }]
      }
    }, info)

    if(trips.length === 0){
      throw new Error('Trip not found')
    }
    console.log("TRIPS", trips, userId);
    return trips[0]
  },

  // all author's trips (published and not)
  myTrips(parent, args, { prisma, request }, info){
    const userId = getUserId(request);
    const opArgs = {
      orderBy: args.orderBy,
      where: {
        author: {
          id: userId
        }
      }
    };

    if(args.query){
      opArgs.where.OR = [{
        traveled_from_contains: args.query
      },{
        travel_to_contains: args.query
      }]
    };
    // console.log("prisma.query.trips(opArgs, info)", prisma.query.trips(opArgs, info));
    return prisma.query.trips(opArgs, info)
  },

  stops(parent, args, { prisma }, info){
    // console.log("QUERY.JS", db.stops);
    return prisma.query.stops({orderBy: args.orderBy,}, info)
  },

  async myStops(parent, args, { prisma, request }, info){
    const userId = getUserId(request);

    const opArgs = {
      orderBy: args.orderBy,
      where: {
        author: {
          id: userId
        },
      }
    };
    const myTripsOnly = await prisma.query.trips(opArgs, info);
    // console.log("myTripsOnly", myTripsOnly);
    const trips = myTripsOnly.map(t => t.id);

    const stopArgs = {
      where:{
        trip:{
          id_in: trips
        }
      }
    };

    return prisma.query.stops(stopArgs, info);
  },

  comments(parent, args, { prisma }, info){
    return prisma.query.comments({orderBy: args.orderBy,}, info)
  },

  async myComments(parent, args, { prisma, request }, info){
    const userId = getUserId(request);
    const opArgs = {
      orderBy: args.orderBy,
      where: {
        author: {
          id: userId
        }
      }
    };

    return await prisma.query.comments(opArgs, info);
  },

  photos(parent, args, { prisma }, info){
    console.log('QUERY photos', args);
    // const opArgs = {
    // orderBy: args.orderBy,
    // };
    // if(args.query) {
    //   opArgs.where = {
    //     OR:[{
    //       author: args.query
    //     }, {
    //       trip: args.query
    //     }]
    //   }
    // };
    // return prisma.query.photos(opArgs, info)
    //
    return prisma.query.photos(null, info)
  },

  conversations(parent, args, { prisma, request }, info){
    const userId = getUserId(request);
    const opArgs = {
      orderBy: args.orderBy,
      where: {
        sender: {
          id: userId
        }
      }
    };

    return prisma.query.conversations(opArgs, info)

  },

  messages(parent, args, { prisma, request }, info){
    const userId = getUserId(request);
    const opArgs = {
      orderBy: args.orderBy,
      where: {
        conversation_id:{
          sender: {
            id: userId
          }
        }
      }
    };
    return prisma.query.messages(opArgs, info)
  }


}


export {Query as default};
