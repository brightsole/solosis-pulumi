import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import callbackFactory from './src/server';

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
      name: 'id',
      type: 'S',
    },
    {
      name: 'name',
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
  ],
  hashKey: 'id',
  readCapacity: 5,
  writeCapacity: 5,
});

// Create an API endpoint
const endpoint = new awsx.apigateway.API('solosis', {
  routes: [
    {
      path: '/graphql',
      method: 'ANY',
      eventHandler: new aws.lambda.CallbackFunction('solosis', {
        // set this high because low memory often costs more with long times
        memorySize: 1024,
        environment: {
          variables: {
            TOKEN: config.token,
            REGION: pulumi.all([aws.getRegion()]).apply(([region]) => region.id),
            TABLE_NAME: config.tableName,
          },
        },
        policies: [
          // able to be executed
          aws.iam.ManagedPolicies.AWSLambdaVPCAccessExecutionRole,
          // need to be able to create and modify the function
          aws.iam.ManagedPolicy.LambdaFullAccess,
          // this function needs permissions to access that database
          aws.iam.ManagedPolicy.AmazonDynamoDBFullAccess,
          // to enable complex functionality, we need access to event bridge emissions
          'arn:aws:iam::aws:policy/AmazonEventBridgeFullAccess',
        ],
        callbackFactory,
      } as any),
    },
  ],
});

exports.endpoint = endpoint.url;
