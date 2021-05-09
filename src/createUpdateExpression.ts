export type Expression = {
  UpdateExpression: string;
  ExpressionAttributeNames: {
    [key: string]: string;
  };
  ExpressionAttributeValues: {
    [key: string]: string;
  };
};

export default (item: any): Expression => {
  const now = new Date();
  const fields = { ...item, updatedAt: now.toISOString() };

  const baseExpression: Expression = {
    UpdateExpression: 'SET #createdAt = if_not_exists(#createdAt, :createdAt),',
    ExpressionAttributeNames: { '#createdAt': 'createdAt' },
    ExpressionAttributeValues: {
      ':createdAt': now.toISOString(),
    },
  };

  const { length } = Object.keys(fields);
  return Object.entries(fields).reduce(
    (expression, [key, value]: any, i): Expression => ({
      ExpressionAttributeNames: {
        ...expression.ExpressionAttributeNames,
        [`#${key}`]: key,
      },
      ExpressionAttributeValues: {
        ...expression.ExpressionAttributeValues,
        [`:${key}`]: value,
      },
      UpdateExpression: `${expression.UpdateExpression} #${key} = :${key}${
        i === length - 1 ? '' : ','
      }`,
    }),
    baseExpression
  );
};
