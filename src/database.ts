import Database from '@brightsole/sleep-talk';
import getEnv from './env';

const { nanoid } = require('nanoid');

export default <T>() =>
  new Database<T>({
    tableName: getEnv().tableName,
    region: getEnv().region,
    getId: nanoid,
  });
