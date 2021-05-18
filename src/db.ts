import { DynamoDB } from 'aws-sdk';
import { DataSource } from 'apollo-datasource';
import { createUpdateExpression } from './createUpdateExpression';
import { createQueryExpression, Query } from './createQueryExpression';

export type ConstructionProps = {
  getId: () => string;
  tableName: string;
  region: string;
};

export type ItemResponse<T> = {
  item: T;
  consumedCapacity?: number;
};
export type ItemsResponse<T> = {
  lastScannedId?: string;
  count?: number;
  items: T[];
};

export default class DocDatabase<T> extends DataSource {
  client: DynamoDB.DocumentClient;

  tableName: DynamoDB.TableName;

  getId: () => string;

  constructor({ tableName, region, getId }: ConstructionProps) {
    super();

    this.getId = getId;
    this.tableName = tableName;
    this.client = new DynamoDB.DocumentClient({ region });
  }

  async getItem(id: string): Promise<ItemResponse<T>> {
    const result = await this.client
      .get({ Key: id as any, TableName: this.tableName, ReturnConsumedCapacity: 'TOTAL' })
      .promise();

    return { item: result.Item as any, consumedCapacity: result.ConsumedCapacity?.CapacityUnits };
  }

  async createItem(params: Partial<T>): Promise<ItemResponse<T>> {
    const now = new Date();

    const Item = {
      ...params,
      id: this.getId(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const result = await this.client
      .put({ Item, TableName: this.tableName, ReturnConsumedCapacity: 'TOTAL' })
      .promise();

    return { item: Item as any, consumedCapacity: result.ConsumedCapacity?.CapacityUnits };
  }

  async updateItem(params: Partial<T>): Promise<ItemResponse<T>> {
    const { id, ...item } = params as any;
    const updateExpression = createUpdateExpression(item);

    const result = await this.client
      .update({
        Key: { id },
        TableName: this.tableName,
        ReturnValues: 'ALL_NEW',
        ReturnConsumedCapacity: 'TOTAL',
        ...updateExpression,
      })
      .promise();

    return {
      item: result.Attributes as any,
      consumedCapacity: result.ConsumedCapacity?.CapacityUnits,
    };
  }

  async query(query: Query): Promise<ItemsResponse<T>> {
    const result = await this.client
      .query({
        TableName: this.tableName,
        ...createQueryExpression(query),
        ReturnConsumedCapacity: 'TOTAL',
      })
      .promise();

    return {
      lastScannedId: result.LastEvaluatedKey as any,
      items: result.Items as any[],
      count: result.Count,
    };
  }

  async deleteItem(id: string): Promise<ItemResponse<null>> {
    const result = await this.client
      .delete({ Key: id as any, TableName: this.tableName, ReturnConsumedCapacity: 'TOTAL' })
      .promise();

    return { item: null, consumedCapacity: result.ConsumedCapacity?.CapacityUnits };
  }
}
