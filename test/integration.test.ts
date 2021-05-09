import { createTestClient } from 'apollo-server-testing';
import { gql } from 'apollo-server-lambda';
import constructTestServer from './utils';

describe('Resolver full path', () => {
  it('emits new user event if no previous session exists for user', async () => {
    const setHeaderMock = jest.fn();
    const { server, itemSource } = constructTestServer({ setHeaders: { push: setHeaderMock } });
    const itemCreateMock = itemSource.createItem as jest.Mock<any>;

    const itemMutation = gql`
      mutation createItem($input: CreateItemInput!) {
        createItem(input: $input) {
          success
        }
      }
    `;

    const item = {
      name: 'dongle',
    };

    itemCreateMock.mockImplementationOnce(async () => ({
      item,
      success: true,
    }));

    const { mutate } = createTestClient(server);
    const { errors } = await mutate({
      mutation: itemMutation,
      variables: { input: item },
    });

    expect(errors).toBeFalsy();
  });
});
