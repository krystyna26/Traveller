import '@babel/polyfill/noConflict';
import server from './server'

server.start({ port: process.env.PORT || 4000}, () => {
  console.log("Krysiunia, your server is up. Go to localhost:4000 🚀")
  // run: npm run start
  // check localhost:4000

  // heroku uses different port https://github.com/prisma/graphql-yoga Lesson 91
})
