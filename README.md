cd prisma-traveller
npm init (use default values)
npm install
npm install babel-cli@6.26.0 babel-preset-env@1.7.0
from root create: .babelrc file with
{
  "presets": [
    "env"
  ]
}

create file: /src/index.js
from prisma-traveller run: npm run start

from root: npm i graphql-yoga@1.16.7                   // 1.14.10
npm install nodemon@1.17.5 --save-dev
and change "start": "babel-node src/index.js",
to "start": "nodemon src/index.js --exec babel-node",

parent -
args - it is object; contains arguments values we supply
ex: query {
  getUserByName(name: "Jess")
}
here args = {name: "Jess"}

context - contextual data, whatever we store in API
info - contains info about operation

query {
  posts {
    id
    title
    author {
      name
    }
  }
}
in this query we are asking about author so for each post object resolver Post: {
  author(parent is Post here,...)
} will run to get author's name. So if we have 3 posts this function will run 3 times for each post


npm install uuid@3.3.2

npm install babel-plugin-transform-object-rest-spread@6.26.0

change: "start": "nodemon src/index.js --exec babel-node",
to: "start": "nodemon src/index.js --ext js, graphql --exec babel-node",




if Query.users has 6 users then User.posts with run 6 times for each user object 
