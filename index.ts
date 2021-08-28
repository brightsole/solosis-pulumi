import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import restCallback from './src/rest';
import graphqlCallback from './src/graphql';

const stackConfig = new pulumi.Config();

const config = {
  tableName: stackConfig.require('tableName'),
  token: stackConfig.requireSecret('token'),
};

// create a table to point at
new aws.dynamodb.Table(config.tableName, {
  name: config.tableName,
  attributes: [
    {
      name: 'hashKey',
      type: 'S',
    },
    {
      name: 'id',
      type: 'S',
    },
    {
      name: 'name',
      type: 'S',
    },
    {
      name: 'updatedAt',
      type: 'S',
    },
    {
      name: 'createdAt',
      type: 'S',
    },
  ],
  globalSecondaryIndexes: [
    {
      projectionType: 'ALL',
      writeCapacity: 5,
      readCapacity: 5,
      hashKey: 'name',
      name: 'name',
    },
    {
      projectionType: 'ALL',
      writeCapacity: 5,
      readCapacity: 5,
      hashKey: 'updatedAt',
      name: 'updatedAt',
    },
    {
      projectionType: 'ALL',
      writeCapacity: 5,
      readCapacity: 5,
      hashKey: 'createdAt',
      name: 'createdAt',
    },
  ],
  hashKey: 'hashKey',
  rangeKey: 'id',
  readCapacity: 5,
  writeCapacity: 5,
});

// some variables used in both types of endpoints
const policies = [
  // able to be executed
  aws.iam.ManagedPolicies.AWSLambdaVPCAccessExecutionRole,
  // need to be able to create and modify the function
  aws.iam.ManagedPolicy.LambdaFullAccess,
  // this function needs permissions to access that database
  aws.iam.ManagedPolicy.AmazonDynamoDBFullAccess,
  // to enable complex functionality, we need access to event bridge emissions
  'arn:aws:iam::aws:policy/AmazonEventBridgeFullAccess',
];
const variables = {
  TOKEN: config.token,
  REGION: pulumi.all([aws.getRegion()]).apply(([region]) => region.id),
  TABLE_NAME: config.tableName,
};

const graphqlHandler = new aws.lambda.CallbackFunction('solosis-graphql', {
  callbackFactory: graphqlCallback,
  environment: { variables },
  memorySize: 1024,
  policies,
} as any);
const restHandler = new aws.lambda.CallbackFunction('solosis-rest', {
  callbackFactory: restCallback,
  environment: { variables },
  memorySize: 1024,
  policies,
} as any);

// Create an API endpoint
const endpoint = new awsx.apigateway.API('solosis', {
  routes: [
    {
      path: '/graphql',
      method: 'ANY',
      eventHandler: graphqlHandler,
    },
    {
      path: '/things/{id}',
      method: 'POST',
      contentType: 'application/json',
      eventHandler: restHandler,
    },
    {
      path: '/things/{id}',
      method: 'PUT',
      contentType: 'application/json',
      eventHandler: restHandler,
    },
    {
      path: '/things/{id}',
      method: 'GET',
      contentType: 'application/json',
      eventHandler: restHandler,
    },
    {
      path: '/things/{id}',
      method: 'DELETE',
      contentType: 'application/json',
      eventHandler: restHandler,
    },
    {
      path: '/things',
      method: 'POST',
      contentType: 'application/json',
      eventHandler: restHandler,
    },
    {
      path: '/things',
      method: 'GET',
      contentType: 'application/json',
      eventHandler: restHandler,
    },
  ],
});

exports.endpoint = endpoint.url;
