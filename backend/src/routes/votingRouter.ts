import * as Express from 'express';
import { query } from '../db';

const votingRouter = Express.Router();

//Person can only vote twice

votingRouter.post('/vote', async (req, res) => {
  const unique_code = req.body.unique_code;
  const song_ids = req.body.song_ids as Number[];

  if (!unique_code || !song_ids) {
    return res.status(400).send({ status: 'bad request' });
  }

  const queryRes = await query('SELECT * FROM person WHERE unique_code = $1', [
    unique_code
  ]);

  if (queryRes.rows.length == 0) {
    return res.status(404).send({ status: 'person not found' });
  }

  const person = queryRes.rows[0];

  if (person.voted) {
    return res.status(400).send({ status: 'person already voted' });
  }

  await query(
    `INSERT INTO song_votes (song_id, user_id, ranking) VALUES ${song_ids
      .map((s, index) => `('${s}', '${person.id}', '${index + 1}')`)
      .join(', ')}`,
    []
  );

  await query('UPDATE person SET voted = true WHERE id = $1', [person.id]);

  return res.status(200).send({ status: 'success' });
});

export default votingRouter;
