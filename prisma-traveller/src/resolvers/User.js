const User = {
  // user is a parent obj
  comments(parent, args, { db }, info) {
    console.log('USER.JS comments', db.comments);
    return db.comments.filter(comment => {
      return comment.author === parent.id;
    });
  },

  trips(parent, args, { db }, info){
    console.log('USER.JS trips', db.trips);
    return db.trips.filter(trip => {
      return trip.author === parent.id;
    })
  },

  avatar_url(parent, args, { db }, info){
    console.log("avatar_url~~~~~~~~~~~");
    return db.photos.find(photo => {
      console.log("USER.PHOTO", photo, parent);
      return photo.id === parent.avatar_url
    })
  }
}

export { User as default};
// filter runs till the end of the array,
// and invokes its callback on every item => new [elements];
// in contrast to find which stops after having found one => element
// some => boolean
