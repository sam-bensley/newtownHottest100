import * as Express from 'express';
import { query } from '../db';

const userRouter = Express.Router();

userRouter.get('/', async (req, res) => {
  const unique_code = req.query.unique_code;

  if (!unique_code) {
    return res.status(400).send({ status: 'bad request' });
  }

  const queryRes = await query('SELECT * FROM person WHERE unique_code = $1', [
    unique_code
  ]);

  if (queryRes.rows.length == 0) {
    return res.status(404).send({ status: 'person not found' });
  }

  return res.status(200).send({ staus: 'success', user: queryRes.rows[0] });
});

export default userRouter;
