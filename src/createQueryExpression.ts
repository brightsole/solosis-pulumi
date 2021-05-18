import { createExpressions, ExpressionAttributes } from './createExpressions';

type QueryMatch =
  | boolean
  | string
  | number
  | {
      $notContains?: string;
      $contains?: string;
      $notNull?: string;
      $isNull?: string;
      $notEq?: string;
      $gt?: string;
      $lt?: string;
    };
export type Query = {
  $isAscending?: boolean;
  $startFromId?: string;
  $sortKey?: string;
  $limit?: number;
  [index: string]: undefined | QueryMatch;
};

export type QueryInput = {
  KeyConditionExpression: string;
  ScanIndexForward?: boolean;
  ExclusiveStartKey?: any; // strings
  Limit?: number;
  Select: string;
} & ExpressionAttributes;

const matchingExpression = (queryMatch: QueryMatch): string => {
  if (queryMatch && typeof queryMatch === 'object') {
    const matchKeys = Object.keys(queryMatch);

    if (matchKeys.includes('$notContains')) return 'NOT_CONTAINS';
    if (matchKeys.includes('$contains')) return 'CONTAINS';
    if (matchKeys.includes('$notNull')) return 'NOT_NULL';
    if (matchKeys.includes('$isNull')) return 'NULL';
    if (matchKeys.includes('$notEq')) return 'NE';
    if (matchKeys.includes('$gt')) return 'GT';
    if (matchKeys.includes('$lt')) return 'LT';
  }
  return '=';
};

export const createQueryExpression = (query: Query, override: string = ''): QueryInput => {
  const { $startFromId, $isAscending = true, $sortKey, $limit, ...rest } = query;

  const flatProperties = Object.entries(rest).reduce((res, [key, value]) => {
    const isMatchingParameter = value && typeof value === 'object';
    return isMatchingParameter
      ? { ...res, [key]: Object.values(value as any)[0] }
      : { ...res, [key]: value };
  }, {});

  const KeyConditionExpression = Object.entries(rest).reduce(
    (expression: string, [key, val]: any, i: number): string =>
      `${expression}${i === 0 ? '' : ' AND '}#${key} ${matchingExpression(val)} :${key}`,
    override
  );

  return {
    KeyConditionExpression,
    Select: 'ALL_ATTRIBUTES',
    ScanIndexForward: $isAscending,
    ...($limit && { Limit: $limit }),
    ...createExpressions(flatProperties),
    ...($startFromId && { ExclusiveStartKey: $startFromId }),
  };
};
