import { extractFragmentReplacements } from 'prisma-binding';
import Query from "./Query";
import Mutation from "./Mutation";
import User from "./User";
import Comment from "./Comment";
import Trip from "./Trip";
import Photo from "./Photo";
import Stop from "./Stop";
import Message from './Message';
import Conversation from './Conversation';
import Subscription from "./Subscription";

const resolvers = {
  Query,
  Mutation,
  User,
  Comment,
  Trip,
  Photo,
  Stop,
  Message,
  Conversation,
  Subscription
};

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }
