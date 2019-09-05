const Photo = {
  trip(parent, args, {db }, info){
    return db.trips.find(trip => {
      console.log("trip.id,  parent.trip", trip,  parent);
      return trip.id === parent.trip
    });


  },

  author(parent, args, {db }, info){
    return db.users.find(user =>{
      console.log("user.id, parent.author", user.id,  parent.author);
      return user.id === parent.author
    })
  }
}

export { Photo as default }
