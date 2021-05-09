import { getResolvers } from './resolvers';

describe('Resolvers', () => {
  describe('Query', () => {
    it('calls getItem on the dataSource with id', async () => {
      const id = '123';

      const dataSources = {
        itemSource: {
          getItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Query: { item },
      } = getResolvers();

      await item(null, id, { dataSources });
      expect(dataSources.itemSource.getItem).toHaveBeenCalledWith(id);
    });

    it('reference resolver calls getItem on the dataSource with { id }', async () => {
      const id = '123';

      const dataSources = {
        itemSource: {
          getItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Item: { __resolveReference },
      } = getResolvers();

      await __resolveReference({ id }, { dataSources });
      expect(dataSources.itemSource.getItem).toHaveBeenCalledWith(id);
    });
  });

  describe('Mutate', () => {
    it('calls createItem on the dataSource with { id, name }', async () => {
      const item = { id: '123', name: 'widget' };

      const dataSources = {
        itemSource: {
          createItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Mutation: { createItem },
      } = getResolvers();

      await createItem(null, { input: item }, { dataSources });
      expect(dataSources.itemSource.createItem).toHaveBeenCalledWith(item);
    });

    it('calls updateItem on the dataSource with { id, name }', async () => {
      const item = { id: '123', name: 'widget' };

      const dataSources = {
        itemSource: {
          updateItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Mutation: { updateItem },
      } = getResolvers();

      await updateItem(null, { input: item }, { dataSources });
      expect(dataSources.itemSource.updateItem).toHaveBeenCalledWith(item);
    });

    it('calls deleteItem on the dataSource with id', async () => {
      const id = '123';

      const dataSources = {
        itemSource: {
          deleteItem: jest.fn(() => Promise.resolve({})),
        },
      };

      const {
        Mutation: { deleteItem },
      } = getResolvers();

      await deleteItem(null, id, { dataSources });
      expect(dataSources.itemSource.deleteItem).toHaveBeenCalledWith(id);
    });
  });
});
