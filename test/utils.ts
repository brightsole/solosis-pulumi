import { ApolloServer } from 'apollo-server';
import { buildFederatedSchema } from '@apollo/federation';
import { getResolvers } from '../src/resolvers';
import getTypeDefs from '../src/schema';
import DataBase from '../src/db';

jest.mock('../src/db');

export default (context = {}) => {
  const itemSource = new DataBase({} as any);

  const server = new ApolloServer({
    schema: buildFederatedSchema([
      {
        typeDefs: getTypeDefs(),
        resolvers: getResolvers(),
      } as any,
    ]),
    typeDefs: getTypeDefs(),
    resolvers: getResolvers() as any,
    dataSources: () => ({ itemSource }),
    context,
  });

  return { server, itemSource, context };
};
