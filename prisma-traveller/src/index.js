import '@babel/polyfill/noConflict';
import server from './server'

server.start({ port: process.env.PORT || 4000}, () => {
  console.log("Server is up")
  // run: npm run start
  // check localhost:4000

  // heroku uses different port https://github.com/prisma/graphql-yoga Lesson 91
})
