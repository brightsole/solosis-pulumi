import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server-lambda';
import constructTestServer from './utils';

describe('Resolver full path', () => {
  it('creates an item without error', async () => {
    const setHeaderMock = jest.fn();
    const { server, itemSource } = constructTestServer({ setHeaders: { push: setHeaderMock } });
    const itemCreateMock = itemSource.createItem as jest.Mock<any>;

    const itemMutation = gql`
      mutation createItem($input: CreateItemInput!) {
        createItem(input: $input) {
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

    const { mutate } = createTestClient(server);
    const { errors } = await mutate({
      mutation: itemMutation,
      variables: { input: item },
    });

    expect(errors).toBeFalsy();
  });
});
