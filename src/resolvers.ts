import { GraphQLDateTime } from 'graphql-iso-date';
import { rule, shield } from 'graphql-shield';
import { Item, Input, GenericItemPayload } from './types';
import getEnv from './env';

// restricts the very open api to only allow queries from sources
// that know our internal secure api token
const matchesToken = () =>
  rule({ cache: 'contextual' })(
    async (_parent, _args, context) => context.token === getEnv().token
  );

export const getPermissions = () =>
  shield({
    Query: {
      '*': matchesToken(),
    },
    Mutation: {
      '*': matchesToken(),
    },
  });

export const getResolvers = () => ({
  Query: {
    item: async (_: any, id: string, { dataSources }: any) => {
      const item = await dataSources.itemSource.getItem(id);
      return { item, success: true };
    },
  },

  Mutation: {
    createItem: (_: any, args: Input, { dataSources }: any): Promise<GenericItemPayload> =>
      dataSources.itemSource.createItem(args.input),
    updateItem: (_: any, args: Input, { dataSources }: any): Promise<GenericItemPayload> =>
      dataSources.itemSource.updateItem(args.input),
    deleteItem: (_: any, id: string, { dataSources }: any): Promise<GenericItemPayload> =>
      dataSources.itemSource.deleteItem(id),
  },

  Item: {
    __resolveReference: ({ id }: Partial<Item>, { dataSources }: any) =>
      dataSources.itemSource.getItem(id),
  },

  DateTime: GraphQLDateTime,
});
