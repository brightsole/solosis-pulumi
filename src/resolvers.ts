import { GraphQLDateTime } from 'graphql-iso-date';
import { GraphQLJSONObject } from 'graphql-type-json';
import { rule, shield } from 'graphql-shield';
import { Item, Input, IdObject, GenericItemPayload } from './types';
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
    item: async (_: any, args: IdObject, { dataSources, hashKey }: any) =>
      dataSources.itemSource.getItem(args.id, { hashKey }),
    items: async (_: any, args: Input, { dataSources, hashKey }: any) =>
      dataSources.itemSource.query(args.input, { hashKey }),
    getAll: async (_: any, __: any, { dataSources, hashKey }: any) =>
      dataSources.itemSource.getAll({ hashKey }),
  },

  Mutation: {
    createItem: (_: any, args: Input, { dataSources, hashKey }: any): Promise<GenericItemPayload> =>
      dataSources.itemSource.createItem(args.input, { hashKey }),
    updateItem: (_: any, args: Input, { dataSources, hashKey }: any): Promise<GenericItemPayload> =>
      dataSources.itemSource.updateItem(args.input, { hashKey }),
    deleteItem: (
      _: any,
      args: IdObject,
      { dataSources, hashKey }: any
    ): Promise<GenericItemPayload> => dataSources.itemSource.deleteItem(args.id, { hashKey }),
  },

  Item: {
    __resolveReference: ({ id }: Partial<Item>, { dataSources, hashKey }: any) =>
      dataSources.itemSource.getItem(id, { hashKey }),
  },

  DateTime: GraphQLDateTime,
  JSONObject: GraphQLJSONObject,
});
