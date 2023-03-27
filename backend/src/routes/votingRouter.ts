import * as Express from 'express';
import { query } from '../db';

const votingRouter = Express.Router();

//Person can only vote twice
votingRouter.post('/vote', async (req, res) => {
  const unique_code = req.body.unique_code;
  const song_id = req.body.song_id;

  if (!unique_code || !song_id) {
    return res.status(400).send({ status: 'bad request' });
  }

  const queryRes = await query('SELECT * FROM person WHERE unique_code = $1', [
    unique_code
  ]);

  if (queryRes.rows.length == 0) {
    return res.status(404).send({ status: 'person not found' });
  }

  const person = queryRes.rows[0];

  if (person.votes >= 2) {
    return res.status(400).send({ status: 'person already voted' });
  }

  const insertRes = await query(
    `INSERT INTO vote (song_id, user_id) VALUES (${song_id}, ${person.id})`,
    []
  );

  if (insertRes.rowCount != 1) {
    return res.status(500).send({ status: 'internal server error' });
  }

  await query('UPDATE person SET votes = votes + 1 WHERE id = $1', [person.id]);

  return res.status(200).send({ status: 'success' });
});

export default votingRouter;
