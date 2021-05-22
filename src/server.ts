import { ApolloServer } from 'apollo-server-lambda';
import * as depthLimit from 'graphql-depth-limit';
import { applyMiddleware } from 'graphql-middleware';
import { buildFederatedSchema } from '@apollo/federation';
import Database from '@brightsole/sleep-talk';
import { getResolvers } from './resolvers';
import getSchema from './schema';
import getEnv from './env';

const httpHeadersPlugin = require('apollo-server-plugin-http-headers');
const { nanoid } = require('nanoid');

const createServer = () => {
  const itemSource = new Database({
    tableName: getEnv().tableName,
    region: getEnv().region,
    getId: nanoid,
  });

  const typeDefs: any = getSchema();
  const resolvers = getResolvers();
  // const permissions = getPermissions();

  return new ApolloServer({
    schema: applyMiddleware(
      buildFederatedSchema([
        {
          typeDefs,
          resolvers,
        } as any,
      ])
      // permissions
    ),

    plugins: [httpHeadersPlugin],
    context: async ({ event, context }) => {
      context.callbackWaitsForEmptyEventLoop = false;

      const { 'x-auth-token': token, 'x-user-id': hashKey } = event.headers; // populate context with this
      return {
        setHeaders: [],
        setCookies: [],
        hashKey,
        token,
        event,
      };
    },
    validationRules: [depthLimit(7)],
    dataSources: () => ({ itemSource }),
  });
};

export default () => {
  const server = createServer();

  return server.createHandler();
};
