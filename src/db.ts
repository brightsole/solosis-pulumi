import { DynamoDB } from 'aws-sdk';
import { DataSource } from 'apollo-datasource';
import createUpdateExpression from './createUpdateExpression';
import getEnv from './env';

const { nanoid } = require('nanoid');

export type ConstructionProps = {
  tableName: string;
};

export default class DocDatabase extends DataSource {
  client: DynamoDB.DocumentClient;

  tableName: DynamoDB.TableName;

  constructor({ tableName }: ConstructionProps) {
    super();

    this.tableName = tableName;
    this.client = new DynamoDB.DocumentClient({ region: getEnv().region });
  }

  async getItem(id: string) {
    const result = await this.client.get({ Key: id as any, TableName: this.tableName }).promise();

    return result.Item;
  }

  async createItem(params: any) {
    const now = new Date();
    const Item = {
      ...params,
      id: nanoid(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    await this.client.put({ Item, TableName: this.tableName }).promise();

    return { item: Item, success: true };
  }

  async updateItem(params: any) {
    const { id, ...item } = params;

    const updateExpression = createUpdateExpression(item);
    const body = {
      Key: { id },
      TableName: this.tableName,
      ReturnValues: 'ALL_NEW',
      ...updateExpression,
    };

    const result = await this.client.update(body).promise();
    return { item: result.Attributes, success: true };
  }

  // TODO - very important functionality
  // async query(params) {
  //   return this.client.query(params).promise();
  // }

  async deleteItem(id: string) {
    await this.client.delete({ Key: id as any, TableName: this.tableName }).promise();
    return { item: null, success: true };
  }
}
