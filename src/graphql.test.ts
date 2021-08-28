import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server-lambda';
import getGraphqlServer from '../test/getGraphqlServer';

// INTEGRATION TEST OF THE FULL PATH
// more detailed tests exist in the resolvers file

describe('Resolver full path', () => {
  it('creates an item without error', async () => {
    const setHeaderMock = jest.fn();
    const { server, thingSource } = getGraphqlServer({ setHeaders: { push: setHeaderMock } });
    const itemCreateMock = thingSource.createItem as jest.Mock<any>;

    const thingMutation = gql`
      mutation CreateThing($input: CreateThingInput!) {
        createThing(input: $input) {
          item {
            id
          }
        }
      }
    `;

    const item = {
      name: 'dongle',
    };

    itemCreateMock.mockImplementationOnce(async () => ({
      item: {
        id: 'threeve',
        ...item,
      },
    }));

    const { mutate } = createTestClient(server as any);
    const { errors } = await mutate({
      mutation: thingMutation,
      variables: { input: item },
    });

    expect(errors).toBeFalsy();
  });
});
