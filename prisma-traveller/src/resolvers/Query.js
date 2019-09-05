const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return users.filter(user => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },

  trips(parent, args, { db }, info) {
    return db.trips
  },

  stops(parent, args, {db}, info){
    // console.log("QUERY.JS", db.stops);
    return db.stops
  },

  comments(parent, args, {db }, info){
    return db.comments
  },

  photos(parent, args, { db }, info){
    return db.photos
  },


}


export {Query as default};
