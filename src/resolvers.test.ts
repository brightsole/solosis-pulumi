import { getResolvers } from './resolvers';

describe('Resolvers', () => {
  const hashKey = 'threeve';

  describe('Queries', () => {
    it('getThing calls getItem on the dataSource with id', async () => {
      const id = '123';

      const dataSources = {
        thingSource: {
          getItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Query: { thing },
      } = getResolvers();

      await thing(null, { id }, { dataSources, hashKey });
      expect(dataSources.thingSource.getItem).toHaveBeenCalledWith(id, { hashKey });
    });

    it('getAllThings calls getAll with { hashKey }', async () => {
      // the expectation is that most queries will be getting all things related to a hash id
      // that hash id is the user id in this implementation
      const dataSources = {
        thingSource: {
          getAll: jest.fn(() => Promise.resolve([])),
        },
      };

      const {
        Query: { getAllThings },
      } = getResolvers();

      await getAllThings(null, {}, { dataSources, hashKey });
      expect(dataSources.thingSource.getAll).toHaveBeenCalledWith({ hashKey });
    });

    it('things calls query with { ...query }', async () => {
      const input = {
        name: { $contains: 'floop' },
      };
      // this is the slower dynamodb scan that has a more open query structure than `getAll`
      const dataSources = {
        thingSource: {
          query: jest.fn(() => Promise.resolve([])),
        },
      };

      const {
        Query: { things },
      } = getResolvers();

      await things(null, { input }, { dataSources });
      expect(dataSources.thingSource.query).toHaveBeenCalledWith(input);
    });

    it('reference resolver calls getItem on the dataSource with { id }', async () => {
      const id = '123';

      const dataSources = {
        thingSource: {
          getItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Item: { __resolveReference },
      } = getResolvers();

      await __resolveReference({ id }, { dataSources, hashKey });
      expect(dataSources.thingSource.getItem).toHaveBeenCalledWith(id, { hashKey });
    });
  });

  describe('Mutations', () => {
    it('createThing calls createItem on the dataSource with { id, name }', async () => {
      const input = { id: '123', name: 'widget' };

      const dataSources = {
        thingSource: {
          createItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Mutation: { createThing },
      } = getResolvers();

      await createThing(null, { input }, { dataSources, hashKey });
      expect(dataSources.thingSource.createItem).toHaveBeenCalledWith(input, { hashKey });
    });

    it('updateThing calls updateItem on the dataSource with { id, name }', async () => {
      const input = { id: '123', name: 'widget' };

      const dataSources = {
        thingSource: {
          updateItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Mutation: { updateThing },
      } = getResolvers();

      await updateThing(null, { input }, { dataSources, hashKey });
      expect(dataSources.thingSource.updateItem).toHaveBeenCalledWith(input, { hashKey });
    });

    it('deleteThing calls deleteItem on the dataSource with id', async () => {
      const id = '123';

      const dataSources = {
        thingSource: {
          deleteItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Mutation: { deleteThing },
      } = getResolvers();

      await deleteThing(null, { id }, { dataSources, hashKey });
      expect(dataSources.thingSource.deleteItem).toHaveBeenCalledWith(id, { hashKey });
    });
  });
});
