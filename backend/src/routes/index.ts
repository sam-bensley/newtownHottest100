import * as Express from 'express';
import { query } from '../db';

const mainRouter = Express.Router();

//health check
mainRouter.get('/', (req, res) => {
  res.status(200).send('healthy');
});

mainRouter.get('/user', async (req, res) => {
  const unique_code = req.query.unique_code;

  if (!unique_code) {
    return res.status(400).send('Bad Request');
  }

  const queryRes = await query('SELECT * FROM person WHERE unique_code = $1', [
    unique_code
  ]);

  if (queryRes.rows.length == 0) {
    return res.status(404).send('Person Not Found');
  }

  return res.status(200).send({ user: queryRes.rows[0] });
});

mainRouter.post('/submit', async (req, res) => {
  const unique_code = req.body.unique_code;
  const songs: {
    title: string;
    artist: string;
    spotify_link: string;
  }[] = req.body.songs;

  if (!unique_code || !songs) {
    return res.status(400).send('Bad Request');
  }

  const queryRes = await query('SELECT * FROM person WHERE unique_code = $1', [
    unique_code
  ]);

  if (queryRes.rows.length == 0) {
    return res.status(404).send('Person Not Found');
  }

  const person = queryRes.rows[0];

  if (person.submitted) {
    return res.status(400).send('Already Submitted');
  }

  const insertRes = await query(
    `INSERT INTO song (title, artist, spotify_link, user_id) VALUES ${songs
      .map((s) => `(${s.title}, ${s.artist}, ${s.spotify_link}, ${person.id})`)
      .join(', ')}})`,
    []
  );

  if (insertRes.rowCount != songs.length) {
    return res.status(500).send('Internal Server Error');
  }

  await query('UPDATE person SET submitted = true WHERE id = $1', [person.id]);

  return res.status(200).send('Success');
});

//Person can only vote twice
mainRouter.post('vote', async (req, res) => {
  const unique_code = req.body.unique_code;
  const song_id = req.body.song_id;

  if (!unique_code || !song_id) {
    return res.status(400).send('Bad Request');
  }

  const queryRes = await query('SELECT * FROM person WHERE unique_code = $1', [
    unique_code
  ]);

  if (queryRes.rows.length == 0) {
    return res.status(404).send('Person Not Found');
  }

  const person = queryRes.rows[0];

  if (person.votes >= 2) {
    return res.status(400).send('Already Voted');
  }

  const insertRes = await query(
    `INSERT INTO vote (song_id, user_id) VALUES (${song_id}, ${person.id})`,
    []
  );

  if (insertRes.rowCount != 1) {
    return res.status(500).send('Internal Server Error');
  }

  await query('UPDATE person SET votes = votes + 1 WHERE id = $1', [person.id]);

  return res.status(200).send('Success');
});

export default mainRouter;
