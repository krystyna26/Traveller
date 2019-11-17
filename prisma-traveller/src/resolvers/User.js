import getUserId from '../utils/getUserId';

const User = {
  // with prisma we need to commented out whole code below to not override
  // user's comments, trips andavatar_url and we will stil be able to get
  // relational data. That's all thanks to prisma

  // ========== whithout prisma ==========
  // user is a parent obj
  // comments(parent, args, { db }, info) {
  //   console.log('USER.JS comments', db.comments);
  //   return db.comments.filter(comment => {
  //     return comment.author === parent.id;
  //   });
  // },
  //
  // trips(parent, args, { db }, info){
  //   console.log('USER.JS trips', db.trips);
  //   return db.trips.filter(trip => {
  //     return trip.author === parent.id;
  //   })
  // },
  //
  // avatar_url(parent, args, { db }, info){
  //   console.log("avatar_url~~~~~~~~~~~");
  //   return db.photos.find(photo => {
  //     console.log("USER.PHOTO", photo, parent);
  //     return photo.id === parent.avatar_url
  //   })
  // }
  // we are locking here email; it means that someone won't
  // be able to see another user's email
  email: {
    // using fragment Lesson 77
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { request }, info){
      // parent here is 'info' from Query.users === user obj
      const userId = getUserId(request, false);

      if(userId && userId === parent.id){
        return parent.email
      } else {
        return null
      }
    }
  },

  trips: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { prisma }, info){
      return prisma.query.trips({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      })
    }
  },

}

export { User as default};
// filter runs till the end of the array,
// and invokes its callback on every item => new [elements];
// in contrast to find which stops after having found one => element
// some => boolean
