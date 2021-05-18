import sinon from 'sinon';
import { createExpressions } from './createExpressions';

describe('createExpressions(item)', () => {
  const toDate = new Date(2020, 1, 1, 1, 1, 1, 0);
  sinon.useFakeTimers(toDate);

  test('allows a passthrough', () => {
    const result = createExpressions(
      {},
      {
        ExpressionAttributeNames: { '#createdAt': 'createdAt' },
        ExpressionAttributeValues: {
          ':createdAt': toDate.toISOString(),
        },
      }
    );

    expect(result.ExpressionAttributeNames).toEqual({
      '#createdAt': 'createdAt',
    });
    expect(result.ExpressionAttributeValues).toEqual({
      ':createdAt': toDate.toISOString(),
    });
  });
});
