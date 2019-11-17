import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements
});

export { prisma as default };

// =======================================================
// async function lesson 53
// prisma.query.comments(null, '{ id }').then((data) => {
//   console.log(JSON.stringify(data, undefined, 2));
// })
//
// prisma.exists.Comment({
//   id: "ck08en16900u40801e5qe85gt"
// }).then(exists => {
//   console.log(exists);
// })
// run `npm start` and you will see output in terminal
