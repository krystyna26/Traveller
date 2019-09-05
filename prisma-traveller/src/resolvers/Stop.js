const Stop = {
  trip(parent, args, { db }, info){
    console.log('STOP.JS');
    return db.trips.find(trip => {
      console.log("TRIP:", trip, "parent", parent);
      return trip.id === parent.trip
    })
  }
}
