import * as Express from 'express';
import _ from 'lodash';
import { query } from '../db';

const songRouter = Express.Router();

songRouter.get('/', async (req, res) => {
  const queryRes = await query('SELECT * FROM song');

  return res.status(200).send({ staus: 'success', songs: queryRes.rows });
});

export default songRouter;
