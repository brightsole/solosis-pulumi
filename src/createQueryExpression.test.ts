import { createQueryExpression } from './createQueryExpression';

describe('createQueryExpression(query)', () => {
  const toDate = new Date(2020, 1, 1, 1, 1, 1, 0);

  test('allows a passthrough', () => {
    const result = createQueryExpression({
      userId: 'niner',
      updatedAt: { $gt: toDate.toISOString() },
    });

    expect(result.ExpressionAttributeNames).toEqual({
      '#userId': 'userId',
      '#updatedAt': 'updatedAt',
    });
    expect(result.ExpressionAttributeValues).toEqual({
      ':userId': 'niner',
      ':updatedAt': toDate.toISOString(),
    });

    expect(result.KeyConditionExpression).toEqual('#userId = :userId AND #updatedAt GT :updatedAt');
  });
});
