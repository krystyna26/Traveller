const Comment = {
  author(parent, args, { db }, info){
    // parent is a comment object
    // console.log("USERS FROM COMMENT.JS",  db.users );
    return db.users.find(user => {
      return user.id === parent.author;
    });

  },

  trip(parent, args, { db }, info){
    // 1 comment to 1 trip => find()
    return db.trips.find(trip => {
      // console.log("here", trip, parent);
      return trip.id === parent.trip;
    });
  },

}

export { Comment as default };
