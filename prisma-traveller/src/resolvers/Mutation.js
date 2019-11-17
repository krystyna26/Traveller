// import uuidv4 from "uuid/v4";
import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  // take in password(in CreateUserInput) -> validate pasword(length > 8) -> hash password(bcrypt) -> generate auth token(jwt)
  async createUser(parent, args, { prisma }, info) {

    const hashedPassword = await hashPassword(args.data.password);
    // const emailTaken = await prisma.exists.User({ email: args.data.email });
    // if (emailTaken) {
    //   throw new Error("Email taken.");
    // }

    const user = await prisma.mutation.createUser({
      // look into schema.graphql file to see the shape of 'data' we need here
      // DOCS in localhost:4466 should have the same shape like 'args' below
      // createUser in localhost:4000

      data: {
        ...args.data,
        password: hashedPassword
      }
    }
    // no 'info' Lesson 69
    );

    return {
      user,

      token: generateToken(user.id)
    }
    // ========== whithout prisma ==========
    // const emailTaken = db.users.some(user => user.email === args.data.email);
    //
    // if (emailTaken) {
    //   throw new Error("Email taken.");
    // }
    //
    // // const user = {
    // //   id: uuidv4(),
    // //   name: args.name,
    // //   email: args.email,
    // //   age: args.age
    // // };
    //
    // //how spread operator works. user obj is the same as above
    // const user = {
    //   id: uuidv4(),
    //   ...args.data
    // };
    //
    // db.users.push(user);
    //
    // return user;
    //
    // // this console you can see in terminal
    // console.log("args:", args);
  },

  async login(parent, args, { prisma }, info){
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });
    if(!user){
      throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password);
    if(!isMatch){
      console.log('no match');
      throw new Error("Unable to login")
    };

    return {
      user,
      token: generateToken(user.id)
    }
  },

  async updateUser(parent, args, { prisma, request }, info) {
    // you can only update your profile = whoever is authenticated
    const userId = getUserId(request);

    if(typeof args.data.password === 'string'){
      args.data.password = await hashPassword(args.data.password)
    }
    // check your work in 4000
    return prisma.mutation.updateUser({
      // check the shape for updateUser in 4466
      where:{
        id: userId
      },
      data: args.data
    }, info);

    // ========== whithout prisma ==========
    // // destructured args
    // const { id, data } = args;
    // const user = db.users.find(user => user.id === id);
    //
    // if (!user) {
    //   throw new Error("User not found");
    // }
    //
    // if (typeof data.email === "string") {
    //   const emailTaken = db.users.some(user => user.email === data.email);
    //
    //   if (emailTaken) {
    //     throw new Error("Email taken");
    //   }
    //
    //   user.email = data.email;
    // }
    //
    // if (typeof data.first_name === "string") {
    //   user.first_name = data.first_name;
    // }
    //
    // if (typeof data.last_name === "string") {
    //   user.last_name = data.last_name;
    // }
    //
    // if (typeof data.from === "string") {
    //   user.from = data.from;
    // }
    //
    // if (typeof data.password === "string") {
    //   user.password = data.password;
    // }
    //
    // if (typeof data.age !== "undefined") {
    //   user.age = data.age;
    // }
    // console.log('USER', user);
    //
    // return user;
  },

  async deleteUser(parent, args, { prisma, request }, info){
    const userId = getUserId(request);
    // const userExists = await prisma.exists.User({
    //   id: args.id
    // });
    //
    // if (!userExists) {
    //   throw new Error(" User not found");
    // };

    // thanks to prisma we don't have to handle deleting any posts related to user
    return prisma.mutation.deleteUser({
      // you can check the args structure on localhost:4466
      // check your work on localhost:4000
      where:{
        id: userId
      }
    }, info);

  // ========== whithout prisma ==========
  //   const userIndex = db.users.findIndex(user => {
  //   return user.id === args.id;
  // });
  //
  // if (userIndex === -1) {
  //   throw new Error(" User not found");
  // }
  //
  // const deletedUsers = db.users.splice(userIndex, 1);
  //
  // return deletedUsers[0];

  },

  async createTrip(parent, args, { prisma, request }, info){
    // only logger in user can create a trip
    const userId = getUserId(request);
    return prisma.mutation.createTrip({
      data:{
        traveled_from: args.data.traveled_from,
        traveled_to: args.data.traveled_to,
        travel_started_at: args.data.travel_started_at,
        travel_ended_at: args.data.travel_ended_at,
        author: {
          connect: {
            id: userId,
          }
        },
        budget: args.data.budget,
        published: args.data.published,
        times_taken: args.data.times_taken
      },
    }, info);

  // const trip = {
  //   id: uuidv4(),
  //   ...args.data
  // };
  //
  // db.trips.push(trip);
  // pubsub.publish('trip', { trip })
  //
  //   return trip
  },

  async updateTrip(parent, args, { prisma, request }, info){
    const userId = getUserId(request);
    // confirm that logged in user own something and can update it
    // console.log("userId update trip", userId);
    const tripExists = await prisma.exists.Trip({
      id: args.id,
      author: {
        id: userId
      }
    });
    const isPublished = await prisma.exists.Trip({
      id: args.id,
      published: true,
    })

    if(!tripExists){
      throw new Error("Unable to update trip")
    };

    if(isPublished && args.data.published === false){
      // check mutation 'deleteManyComments' in 4466
      await prisma.mutation.deleteManyComments({
        where: {
          trip:{
            id: args.id
          }
        }
      })
    }

    return prisma.mutation.updateTrip({
      data: args.data,
      where: {
        id: args.id,
      }
    }, info)

    // ========== whithout prisma ==========
    // const trip = db.trips.find(trip => trip.id === args.id);
    // const originalTrip = { ...trip }
    // if(!trip) {
    //   throw new Error("Trip not found")
    // }
    //
    // if(typeof args.data.traveled_from === 'string'){
    //   trip.traveled_from = args.data.traveled_from
    // }
    //
    // if(typeof args.data.traveled_to === 'string'){
    //   trip.traveled_to = args.data.traveled_to
    // }
    //
    // if(typeof args.data.published === 'boolean'){
    //   trip.published = args.data.published
    //
    //
    //   if(originalTrip.published && !trip.published){
    //     //deleted
    //     pubsub.publish('trip', {
    //       trip: {
    //         mutation: "DELETED",
    //         data: originalTrip
    //       }
    //     })
    //   } else if(!originalTrip.published && trip.published){
    //     // created
    //     pubsub.publish('trip', {
    //       trip: {
    //         mutation: "CREATED",
    //         data: trip
    //       }
    //     })
    //   }
    // } else if(trip.published){
    //   // updated
    //   pubsub.publish('trip', {
    //     trip: {
    //       mutation: "UPDATED",
    //       data: trip
    //     }
    //   })
    // }
    //
    // return trip
  },

  async deleteTrip(parent, args, { prisma, request }, info){
    const userId = getUserId(request);
    // confirm that logged in user own something and can delete it
    const tripExists = await prisma.exists.Trip({
      id: args.id,
      author: {
        id: userId
      }
    });

    if(!tripExists){
      throw new Error("Unable to delete trip")
    };

    return prisma.mutation.deleteTrip({
      where: {
        id: args.id
      }
    }, info);

    // ========== whithout prisma ==========
    // const tripIndex = db.trips.findIndex(trip => trip.id === args.id);
    //
    // if(tripIndex == -1){
    //   throw new Error("Trip not found");
    // }
    //
    // const [trip] = db.trips.splice(tripIndex, 1);
    //
    // // delete ralted to this trip stops, comments and photos
    // db.stops = db.stops.filter(stop => stops.trip !== args.id);
    // db.comments = db.comments.filter(comment => comment.trip !== args.id);
    // db.photos = db.photos.filter(photo => photo.trip !== args.id)
    //
    // return trip;
  },

  async createStop(parent, args, { prisma, request }, info){
    // only logged in user can create a stop
    // to the trip where user is author
    const userId = getUserId(request);
    const tripExists = await prisma.exists.Trip({
      id: args.id,
      author: {
        id: userId
      }
    });

    const tripINeed = await prisma.query.trip({
      where:{
        id: args.data.trip
      }
    });

    if(!tripExists){
      throw new Error("Unable to create stop")
    };

    return prisma.mutation.createStop({
      data: {
        destination: args.data.destination,
        description: args.data.description,
        trip: {
          connect:{
            id: args.data.trip
          }
        },
        cost: args.data.cost,
        completed: args.data.completed,
        completedAt: args.data.completedAt
      }
    }, info);
    // ========== whithout prisma ==========
  //   console.log("CREATE STOP:", args.data);
  //   const stop = {
  //     id: uuidv4(),
  //     completed: false,
  //     ...args.data
  //   };
  //
  //   db.stops.push(stop);
  //
  //   console.log("stop:", stop);
  //   return stop;
  // },
  //
  // updateStop(parent, args, {db}, info){
  //   const stop = db.stops.find(stop=> stop.id === args.id);
  //   if(!stop){
  //     throw new Error("Stop not found")
  //   }
  //
  //   if(typeof args.data.destination === 'string'){
  //     stop.destination = args.data.destination
  //     console.log("STOP", stop)
  //   }
  //
  //   if(typeof args.data.description === 'string'){
  //     stop.description = args.data.description
  //   }
  //
  //   if(typeof args.data.cost === 'float'){
  //     stop.cost = args.data.cost
  //   }
  //
  //   if(typeof args.data.completed === 'boolean'){
  //     stop.completed = args.data.completed
  //   }
  //
  //   // what about DateTime type?
  //
  //   return stop;
  },

// works
  async updateStop(parent, args, { prisma, request }, info){
    const userId = getUserId(request);

    const tripsBelongToLoggedInUser = await prisma.query.trips({
      where: {
        author:{
          id: userId
        }
      }
    });
    if(!tripsBelongToLoggedInUser){
      throw new Error("You can't update someone else's stop. This trips doesn't belong to you")
    };

    const tripIds = (tripsBelongToLoggedInUser).map(trip => trip.id);
    const stopArgs = {
      where:{
        trip:{
          id_in: tripIds
        }
      }
    };

    const myStopsss =  await prisma.query.stops(stopArgs, info);
    const stopsIDs = myStopsss.map(stop => stop.id);
    if(!stopsIDs.find(id => args.id === id)){
      throw new Error("This is not your stop. You have to be trip author to edit stop!")
    }

    return prisma.mutation.updateStop({
      where: {
        id: args.id
      },
      data: args.data,
    }, info)
  },

  // works
  async deleteStop(parent, args, { prisma, request }, info){
    const userId = getUserId(request);
    // you are an author
    const tripsBelongToLoggedInUser = await prisma.query.trips({
      where: {
        author:{
          id: userId
        }
      }
    });
    if(!tripsBelongToLoggedInUser){
      throw new Error("You can't delete someone else's stop!")
    };
    // stop exists
    const stopExists = await prisma.exists.Stop({ id: args.id});
    if(!stopExists){
      throw new Error("Cannot delete non existing stop!")
    };
    const tripIds = tripsBelongToLoggedInUser.map(trip=> trip.id);
    const stopArgs = {
      where:{
        trip:{
          id_in: tripIds
        }
      }
    };

    const myStopsss =  await prisma.query.stops(stopArgs, info);
    const stopsIDs = myStopsss.map(stop => stop.id);
    if(!stopsIDs.find(id => args.id === id)){
      throw new Error("This is not your stop. You have to be trip author to delete stop!")
    }

    // const tripWithDesiredStopId = await prisma.query.trips({
    //   where:{
    //     stops_some: {
    //       id: args.id
    //     }
    //   }
    // });
    // if(!tripWithDesiredStopId){
    //   throw new Error("Can't delete this stop.")
    // };

    return prisma.mutation.deleteStop({
      where: {
        id: args.id
      }
    }, info);

      // ========== whithout prisma ==========
    // const stopIndex = db.stops.findIndex(stop=> stop.id === args.id);
    //
    // const [stopDeleted] = db.stops.splice(stopIndex, 1);
    //
    // return stopDeleted
  },

  // works
  async createComment(parent, args, { prisma, request }, info){
    // only logger in user can create a comment
    const userId = getUserId(request);

    const tripExists = await prisma.exists.Trip({
      id: args.data.trip,
      published: true
    });

    if(!tripExists){
      throw new Error("Can't create comment! Check if the trip exists or is published!")
    }

    return prisma.mutation.createComment({
      data: {
        content: args.data.content,
        published: args.data.published,
        trip: {
          connect:{
            id: args.data.trip
          }
        },
        author: {
          connect: {
            id: userId
          }
        }
      }
    }, info);

// ========== whithout prisma ==========
    // const userExist = db.users.some(user => user.id === args.data.author);
    // const tripExist = db.trips.some(trip => trip.id === args.data.trip);
    //
    // if(!userExist || !tripExist){
    //   throw new Error("Unable to find user and trip");
    // }
    //
    // const comment = {
    //   id: uuidv4(),
    //   ...args.data
    // };
    //
    // db.comments.push(comment);

// console.log("SUBSCRIPTION:", pubsub.publish(`comment`, {
//   comment: {
//     mutation: "CREATED",
//     data: comment
//     }
// }));

    // pubsub.publish(`comment ${args.data.trip}`, {
    //   comment: {
    //     mutation: "CREATED",
    //     data: comment
    //     }
    // });

    // return comment;
  },

  async updateComment(parent, args, { prisma, request }, info){
    const userId = getUserId(request);
    const opArgs = {
      where: {
        author: {
          id: userId
        }
      }
    };
    const myComments = await prisma.query.comments(opArgs, info);

    if(!myComments){
      throw new Error("Can't edit someone else's comment!")
    }

    const foundMatch = myComments.find(comment => comment.id === args.id);
    if(!foundMatch){
      throw new Error("You's not authenticated to edit this comment. You must be an author!")
    }
    return prisma.mutation.updateComment({
      where:{
        id: args.id
      },
      data: {
        content: args.data.content,
        published: args.data.published,
        author: {
          connect: {
            id: userId
          }
        }
      }
    }, info);


    // ========== whithout prisma ==========
    // const commentExists = db.comments.find(comment=> comment.id === args.id);
    //
    // if (!commentExists) {
    //   throw new Error('Comment does not exist')
    // }
    //
    // if(typeof args.data.content === 'string'){
    //   commentExists.content = args.data.content
    // }
    //
    // pubsub.publish(`comment ${commentExists.trip}`, {
    //   comment:{
    //     mutation: "UPDATED",
    //     data: commentExists
    //   }
    // })
    //
    // return commentExists;
  },

  async deleteComment(parent, args, { prisma, request } , info){
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id :userId
      }
    });
    if(!commentExists){
      throw new Error("Unable to delete comment. You must be an author!")
    };

    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info);


    // ========== whithout prisma ==========
    // const commentIndex = db.comments.findIndex(
    //   comment => comment.id === args.id
    // );
    //
    // const [deletedComment] = db.comments.splice(commentIndex, 1);
    //
    // pubsub.publish(`comment ${deletedComment.trip}`, {
    //   comment: {
    //     mutation: "DELETE",
    //     data: deletedComment
    //   }
    // })
    //
    // return deletedComment;
  },


  // addPhoto(parent, args, { prisma }, info){
  //   // addPhoto exists in schema.graphql but not in prisma.graphql
  //   // return prisma.mutation.addPhoto({
  //   //   data: args.data
  //   // }, info);
  //
  //   // ========== whithout prisma ==========
  //   // add photo to taken trip
  //   // const userExist = db.users.some(user => user.id === args.data.author);
  //   const tripExist = db.trips.find(trip => trip.id === args.data.trip);
  //   // if (!userExist || !tripExist) {
  //   //   throw new Error("Unable to find user and trip")
  //   // }
  //   const photo = {
  //     id: uuidv4(),
  //     ...args.data,
  //   };
  //   db.photos.push(photo);
  //   if(tripExist.published){
  //     pubsub.publish('photo', {
  //       photo: {
  //         mutation: "CREATED",
  //         data: photo
  //       }
  //     })
  //   };
  //   return photo
  //   // add avatar to user profile
  // },

// can't ask for photosAuthor in playground
// how to distinguish if pic is an avatar or was added to trip?

// READ: https://github.com/jaydenseric/graphql-upload
  async createPhoto(parent, args, { prisma, request }, info){
    const userId = getUserId(request);
    console.log("createPhoto", args.data);

    return prisma.mutation.createPhoto({
      data: {
        url: args.data.url,
        photosAuthor: {
          connect: {
            id: userId
          }
        },
        avatarAuthor: {
          connect: {
            id: userId,
          }
        },
        trip:  args.data.trip,
        caption: args.data.caption
      }
    }, info)
  },

  async updatePhoto(parent, args, { prisma, request }, info){
    console.log("UPDATE PHOTO", args);
    const userId = getUserId(request);

    const photoExists = await prisma.exists.Photo({
      id: args.id,
      photosAuthor: {
        id: userId
      }
    });
    if(!photoExists){
      throw new Error("Can't update this photo!");
    };

    // const photoBelongsToTrip = await prisma.query.photos({
    //   where: {
    //     trip: {
    //       author: {
    //         id: userId
    //       }
    //     }
    //   }
    // });
    // if(!photoBelongsToTrip){
    //   throw new Error("Photo doesn't not belong to this trip!")
    // };

    // const photoBelongsToUser = await prisma.query.photos({
    //   where:{
    //     avatarAuthor:{
    //       id: userId
    //     }
    //   }
    // });
    // if(!photoBelongsToUser){
    //   throw new Error("Avatar doesn't belong to this user!")
    // }


    return prisma.mutation.updatePhoto({
      where: {
        id: args.id
      },
      data: {
        url: args.data.url,
        caption: args.data.caption,
        trip: {
          connect: {
            id: args.data.trip
          }
        },

      }
    }, info)
    // ========== whithout prisma ==========
    // const userExist = db.users.some(user => user.id === args.data.author);
    //
    // if (!userExist) {
    //   throw new Error('User does not exist')
    // }

    // const photoExists = db.photos.find(photo => {
    //   return photo.id === args.id
    // });
    //
    // if (!photoExists) {
    //   throw new Error('Photo does not exist')
    // }
    //
    // if(typeof args.data.trip === 'string'){
    //   photoExists.trip = args.data.trip
    // }
    //
    // if(typeof args.data.url === 'string'){
    //   photoExists.url = args.data.url
    // }
    //
    // if(typeof args.data.caption === 'string'){
    //   photoExists.caption = args.data.caption
    // }
    //
    // return photoExists;
  },
//   mutation {
//   updatePhoto(
//     id: "ck0h8m0dg00e90862wzsi6znh"
//     data: {
//       caption: "updated cap"
//       }
//   ) {
//     id
//     caption
//   }
// }

  deletePhoto(parent, args, { prisma }, info){
    console.log('DELETE PHOTO: ', args);
    return prisma.mutation.deletePhoto({
      where: {
        id: args.id
      }
    }, info);
    // ========== whithout prisma ==========
    // const photoExists = db.photos.find(photo => {
    //   return photo.id === args.id
    // });
    //
    // if (!photoExists) {
    //   throw new Error('Photo does not exist')
    // }
    //
    // const photoIndex = db.photos.findIndex(photo=>photo.id === args.id);
    //
    // const [photoDeleted] = db.photos.splice(photoIndex, 1);
    //
    // return photoDeleted;
  },

  async createConversation(parent, args, { prisma, request }, info){
    // only logger in user can create a conversation
    const userId = getUserId(request);
    console.log("args", args);
    return prisma.mutation.createConversation({
      data: {
        sender: {
          connect: {
            id: userId
          }
        },
        recipient: {
          connect: {
            id: args.data.recipient
          }
        }
      }
    }, info)
  },

  createMessage(paren, args, { prisma, request }, info){
    // only logger in user can create a message
    const userId = getUserId(request);

    // make sure that conversation exists!

    return prisma.mutation.createMessage({
      data: {
        body: args.data.body,
        is_read: args.data.is_read,
        conversation_id: {
          connect: {
            id: args.data.conversation_id
          }
        },
        sender: {
          connect: {
            id: userId
          }
        },
      }
    }, info);
  },

}

export { Mutation as default};
