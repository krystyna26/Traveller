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
    // comment added to trip if published
    subscribe(parent, { tripId }, { db, pubsub }, info){
      const trip  = db.trips.find(trip => trip.id === tripId && trip.published);
      // console.log("trip", trip);
      if(!trip){
        throw new Error("Trip not found")
      }
      console.log("COMMENT SUBSCRIPTION");
      // console.log("COMMENT SUBSCRIPTION", pubsub.asyncIterator(`Comment was added to trip ${tripId}`));
      // console.log("Subscription.comment", pubsub.asyncIterator(`trip ${tripId}`));
      return pubsub.asyncIterator(`Comment was added to trip ${tripId}`)
    }
  },

  trip: {
    //  "Subscription field must return Async Iterable. Received: undefined"
    // lesson 36 and 37
    subscribe(parent, { userId }, { db, pubsub }, info){
      const authorExists = db.users.find(user => user.id === userId);

      if(!authorExists){
        throw new Error('User does not found');

        return pubsub.asyncIterator(`Trip was added by user ${userId}`)
      }
    }
  },

  photos: {
    // photo added as avatar
    // photo added to the trip if published
    subscribe(parent, { tripId, userId }, { db, pubsub }, info){
      const trip = db.trips.find(trip => trip.id === tripId && trip.published);
      console.log("PHOTOS SUBSCRIPTION", trip, userId);
      if(!trip){
        return pubsub.asyncIterator(`User ${userId} add changed its profile photo`)
      } else {
        return pubsub.asyncIterator(`User ${userId} added photo(s) to thr trip`)
      }
    }
  },

  stop: {
    // stop added to trip if published
    subscribe(parent, {tripId}, {db, pubsub}, info){
      const trip = db.trips.find(trip => trip.id === tripId && trip.published);

      if(!trip){
        throw new Error("Trip you're trying to add stop to doesn't exist.")
      }
      return pubsub.asyncIterator(`New stop added to trip ${tripId}`)
    }
  }

}

export { Subscription as default }
