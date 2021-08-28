import getRestServer from '../test/getRestServer';

// INTEGRATION + UNIT TEST
// this is beefier than need be, but integration tests for express are quick & small
// the entire "controller" is just our db for graphql, no need to test it again

describe('getRoutes', () => {
  const hashKey = 'threeve';

  it('GET /things/:id calls getItem on the dataSource with id', async () => {
    const thing = {
      id: '123',
      name: '456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const getItem = jest.fn().mockResolvedValueOnce(thing);

    const thingsDB = { getItem } as any;
    const request = getRestServer(thingsDB);

    const response = await request.get(`/things/${thing.id}`).set('x-user-id', hashKey);

    expect(response.body).toEqual(thing);
    expect(getItem).toBeCalledWith(thing.id, { hashKey });
  });

  it('GET /things/ calls query on the dataSource with query', async () => {
    const thing = {
      id: '123',
      name: '456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const query = jest.fn().mockResolvedValueOnce([thing]);

    const thingsDB = { query } as any;
    const request = getRestServer(thingsDB);

    const response = await request.get('/things?name=456');

    expect(response.body).toEqual([thing]);
    expect(query).toBeCalledWith({ name: '456' });
  });

  it('POST /things/ calls createItem on the dataSource with partial', async () => {
    const partialThing = {
      id: '123',
      name: '456',
    };
    const fullThing = {
      ...partialThing,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createItem = jest.fn().mockResolvedValueOnce(fullThing);

    const thingsDB = { createItem } as any;
    const request = getRestServer(thingsDB);

    const response = await request
      .post('/things')
      .send(partialThing)
      .set('Content-Type', 'application/json')
      .set('x-user-id', hashKey);

    expect(response.body).toEqual(fullThing);
    expect(createItem).toBeCalledWith(partialThing, { hashKey });
  });

  it('PUT /things/:id calls updateItem on the dataSource with partial', async () => {
    const partialThing = {
      id: '123',
      name: '456',
    };
    const fullThing = {
      ...partialThing,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updateItem = jest.fn().mockResolvedValueOnce(fullThing);

    const thingsDB = { updateItem } as any;
    const request = getRestServer(thingsDB);

    const response = await request
      .put(`/things/${partialThing.id}`)
      .send(partialThing)
      .set('Content-Type', 'application/json')
      .set('x-user-id', hashKey);

    expect(response.body).toEqual(fullThing);
    expect(updateItem).toBeCalledWith(partialThing, { hashKey });
  });

  it('DELETE /things/:id calls deleteItem on the dataSource with id', async () => {
    const id = '123';

    const deleteItem = jest.fn().mockResolvedValueOnce(null);

    const thingsDB = { deleteItem } as any;
    const request = getRestServer(thingsDB);

    const response = await request.delete(`/things/${id}`, null).set('x-user-id', hashKey);

    expect(response.body).toEqual(null);
    expect(deleteItem).toBeCalledWith(id, { hashKey });
  });
});
