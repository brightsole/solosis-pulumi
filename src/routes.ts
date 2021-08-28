import { Router, Request, Response } from 'express';
import Database from '@brightsole/sleep-talk';
import { Thing } from './types';

export default (thingDB: Database<Thing>) =>
  Router()
    // query for multiple items using `scan`
    .get('', async (req: Request, res: Response) => {
      const { query } = req;

      const thingsList = await thingDB.query(query as any);
      res.json(thingsList);
    })

    // create a single item
    .post('', async (req: Request, res: Response) => {
      const hashKey = req.header('x-user-id') as any;

      const thing = await thingDB.createItem(req.body, { hashKey });
      res.status(201).json(thing);
    })

    // get single item
    .get('/:id', async (req: Request, res: Response) => {
      const hashKey = req.header('x-user-id') as any;

      const thing = await thingDB.getItem(req.params.id, { hashKey });
      res.json(thing);
    })

    // update single item
    .put('/:id', async (req: Request, res: Response) => {
      const hashKey = req.header('x-user-id') as any;

      const thing = await thingDB.updateItem({ id: req.params.id, ...req.body }, { hashKey });
      res.json(thing);
    })

    // delete single item
    .delete('/:id', async (req: Request, res: Response) => {
      const hashKey = req.header('x-user-id') as any;

      const thing = await thingDB.deleteItem(req.params.id, { hashKey });
      res.json(thing);
    });
