import { ApolloServer } from 'apollo-server-lambda';
import * as depthLimit from 'graphql-depth-limit';
import { applyMiddleware } from 'graphql-middleware';
import { buildFederatedSchema } from '@apollo/federation';
import { getResolvers } from './resolvers';
import getThingDatabase from './database';
import getSchema from './schema';
import { Thing } from './types';

const httpHeadersPlugin = require('apollo-server-plugin-http-headers');

const createServer = () => {
  const thingSource = getThingDatabase<Thing>();
  const typeDefs = getSchema();
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
    dataSources: () => ({ thingSource }),
  });
};

export default () => {
  const server = createServer();

  return server.createHandler();
};
