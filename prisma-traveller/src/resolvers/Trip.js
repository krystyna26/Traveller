const Trip = {
  // trip is parent
  author(parent, args, { db }, info){
    // console.log("TRIP.JS", db.users);
    return db.users.find((user) => {
      // console.log("user id ", user.id);
      return user.id === parent.author
    })
  },

  // return all pictures belong to the trip
  pictures(parent, args, { db }, info){
    return db.photos.filter(photo => {
      // console.log("TRIP.PHOTOS: ", photo, parent);
      return photo.trip === parent.id
    })
  },

  comments(parent, args, { db }, info){
    return db.comments.filter(comment => {
      return comment.trip === parent.id
    })
  },

  stops(parent, args, {db }, info){
    // return db.stops.filter(stop => {
    //   console.log("stop in trip.js", stop, parent);
    //   return stop.id === parent.stops.find(id => id === stop.id)
    // })
    // return all stops ids for particular trip
    // get
    // map

    return db.stops.filter(stop => {
      return stop.trip === parent.id
    })

    // return parent.stops.map(id => {
    //   console.log("~~~~~~~~~TRIP STOPS", parent.stops.map(id => id ));
    //   console.log('stopsArray[]~~~~', db.stops.map(stop => stop['id']));
    //   const stopsArray = db.stops.map(stop => stop['id']);
    //   // db.stops.get('id')
    //   return db.stops.filter(stop => {
    //     console.log("result", parent.stops.map(id => id === stop['id']));
    //     return parent.stops.map(id => id === stop['id']) ? stop : 0
    //   })
    // })
  }
}

export { Trip as default }
