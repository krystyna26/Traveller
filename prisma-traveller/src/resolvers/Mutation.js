import uuidv4 from "uuid/v4";

const Mutation = {

  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email);

    if (emailTaken) {
      throw new Error("Email taken.");
    }

    // const user = {
    //   id: uuidv4(),
    //   name: args.name,
    //   email: args.email,
    //   age: args.age
    // };

    //how spread operator works. user obj is the same as above
    const user = {
      id: uuidv4(),
      ...args.data
    };

    db.users.push(user);

    return user;

    // this console you can see in terminal
    console.log("args:", args);
  },

  updateUser(parent, args, { db }, info) {
  // destructured args
  const { id, data } = args;
  const user = db.users.find(user => user.id === id);

  if (!user) {
    throw new Error("User not found");
  }

  if (typeof data.email === "string") {
    const emailTaken = db.users.some(user => user.email === data.email);

    if (emailTaken) {
      throw new Error("Email taken");
    }

    user.email = data.email;
  }

  if (typeof data.first_name === "string") {
    user.first_name = data.first_name;
  }

  if (typeof data.last_name === "string") {
    user.last_name = data.last_name;
  }

  if (typeof data.from === "string") {
    user.from = data.from;
  }

  if (typeof data.password === "string") {
    user.password = data.password;
  }

  if (typeof data.age !== "undefined") {
    user.age = data.age;
  }
  console.log('USER', user);

  return user;
},

deleteUser(parent, args, {db}, info){
    const userIndex = db.users.findIndex(user => {
    return user.id === args.id;
  });

  if (userIndex === -1) {
    throw new Error(" User not found");
  }

  const deletedUsers = db.users.splice(userIndex, 1);

  return deletedUsers[0];

},

  createTrip(parent, args, { db, pubsub }, info){
    const trip = {
      id: uuidv4(),
      ...args.data
    };

    db.trips.push(trip);
    pubsub.publish('trip', { trip })

      return trip
  },

  updateTrip(parent, args, { db, pubsub }, info){
    const trip = db.trips.find(trip => trip.id === args.id);
    const originalTrip = { ...trip }
    if(!trip) {
      throw new Error("Trip not found")
    }

    if(typeof args.data.traveled_from === 'string'){
      trip.traveled_from = args.data.traveled_from
    }

    if(typeof args.data.traveled_to === 'string'){
      trip.traveled_to = args.data.traveled_to
    }

    if(typeof args.data.published === 'boolean'){
      trip.published = args.data.published


      if(originalTrip.published && !trip.published){
        //deleted
        pubsub.publish('trip', {
          trip: {
            mutation: "DELETED",
            data: originalTrip
          }
        })
      } else if(!originalTrip.published && trip.published){
        // created
        pubsub.publish('trip', {
          trip: {
            mutation: "CREATED",
            data: trip
          }
        })
      }
    } else if(trip.published){
      // updated
      pubsub.publish('trip', {
        trip: {
          mutation: "UPDATED",
          data: trip
        }
      })
    }

    return trip
  },

  deleteTrip(parent, args, { db }, info){
    const tripIndex = db.trips.findIndex(trip => trip.id === args.id);

    if(tripIndex == -1){
      throw new Error("Trip not found");
    }

    const [trip] = db.trips.splice(tripIndex, 1);

    // delete ralted to this trip stops, comments and photos
    db.stops = db.stops.filter(stop => stops.trip !== args.id);
    db.comments = db.comments.filter(comment => comment.trip !== args.id);
    db.photos = db.photos.filter(photo => photo.trip !== args.id)

    return trip;
  },

  createStop(parent, args, {db}, info){
    console.log("CREATE STOP:", args.data);
    const stop = {
      id: uuidv4(),
      completed: false,
      ...args.data
    };

    db.stops.push(stop);

    console.log("stop:", stop);
    return stop;
  },

  updateStop(parent, args, {db}, info){
    const stop = db.stops.find(stop=> stop.id === args.id);
    if(!stop){
      throw new Error("Stop not found")
    }

    if(typeof args.data.destination === 'string'){
      stop.destination = args.data.destination
      console.log("STOP", stop)
    }

    if(typeof args.data.description === 'string'){
      stop.description = args.data.description
    }

    if(typeof args.data.cost === 'float'){
      stop.cost = args.data.cost
    }

    if(typeof args.data.completed === 'boolean'){
      stop.completed = args.data.completed
    }

    // what about DateTime type?

    return stop;
  },

  deleteStop(parent, args, { db }, info){
    const stopIndex = db.stops.findIndex(stop=> stop.id === args.id);

    const [stopDeleted] = db.stops.splice(stopIndex, 1);

    return stopDeleted
  },

  createComment(parent, args, { db, pubsub }, info){

    const userExist = db.users.some(user => user.id === args.data.author);
    const tripExist = db.trips.some(trip => trip.id === args.data.trip);

    if(!userExist || !tripExist){
      throw new Error("Unable to find user and trip");
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    };

    db.comments.push(comment);

// console.log("SUBSCRIPTION:", pubsub.publish(`comment`, {
//   comment: {
//     mutation: "CREATED",
//     data: comment
//     }
// }));

    pubsub.publish(`comment ${args.data.trip}`, {
      comment: {
        mutation: "CREATED",
        data: comment
        }
    });



    return comment;
  },

  updateComment(parent, args, { db, pubsub }, info){
    const commentExists = db.comments.find(comment=> comment.id === args.id);

    if (!commentExists) {
      throw new Error('Comment does not exist')
    }

    if(typeof args.data.content === 'string'){
      commentExists.content = args.data.content
    }

    pubsub.publish(`comment ${commentExists.trip}`, {
      comment:{
        mutation: "UPDATED",
        data: commentExists
      }
    })

    return commentExists;
  },

  deleteComment(parent, args, { db, pubsub } , info){
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.trip}`, {
      comment: {
        mutation: "DELETE",
        data: deletedComment
      }
    })

    return deletedComment;
  },

  addPhotos(parent, args, { db, pubsub }, info){
    // add photo to taken trip
    // const userExist = db.users.some(user => user.id === args.data.author);
    const tripExist = db.trips.find(trip => trip.id === args.data.trip);
    // console.log("trip is published:", tripExist);
    // if (!userExist || !tripExist) {
    //   throw new Error("Unable to find user and trip")
    // }

    const photo = {
      id: uuidv4(),
      ...args.data,
    };

    db.photos.push(photo);
    console.log("mutation addPhoto:", args.data);
    if(tripExist.published){
console.log("ADD PHOTO SUBSCRIPTION");
      pubsub.publish('photo', {
        photo: {
          mutation: "CREATED",
          data: photo
        }
      })
    }

    return photo
    // add avatar to user profile
  },

  updatePhoto(parent, args, { db }, info){
    // const userExist = db.users.some(user => user.id === args.data.author);
    //
    // if (!userExist) {
    //   throw new Error('User does not exist')
    // }

    const photoExists = db.photos.find(photo => {
      return photo.id === args.id
    });

    if (!photoExists) {
      throw new Error('Photo does not exist')
    }

    if(typeof args.data.trip === 'string'){
      photoExists.trip = args.data.trip
    }

    if(typeof args.data.url === 'string'){
      photoExists.url = args.data.url
    }

    if(typeof args.data.caption === 'string'){
      photoExists.caption = args.data.caption
    }

    return photoExists;
  },

  deletePhoto(parent, args, {db}, info){
    const photoExists = db.photos.find(photo => {
      return photo.id === args.id
    });

    if (!photoExists) {
      throw new Error('Photo does not exist')
    }

    const photoIndex = db.photos.findIndex(photo=>photo.id === args.id);

    const [photoDeleted] = db.photos.splice(photoIndex, 1);

    return photoDeleted;
  }

}

export { Mutation as default};
