import cors from 'cors';
import express from 'express';
import supertest from 'supertest';
import compression from 'compression';
import getRoutes from '../src/routes';

const getServer = (thingsDB: any) => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/things', getRoutes(thingsDB));

  app.use(compression());

  return app;
};

export default (thingsDB: any) => supertest(getServer(thingsDB));
