import * as cors from 'cors';
import * as express from 'express';
import * as compression from 'compression';
import getThingDatabase from './database';
import getRoutes from './routes';
import { Thing } from './types';

const serverlessExpress = require('@vendia/serverless-express');

export default () => {
  const thingDB = getThingDatabase<Thing>();

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/things', getRoutes(thingDB));

  app.use(compression());

  return serverlessExpress({ app });
};
