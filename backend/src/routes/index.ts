import * as Express from 'express';
import { query } from '../db';
import _ from 'lodash';

const mainRouter = Express.Router();

//health check
mainRouter.get('/', (req, res) => {
  res.status(200).send('healthy');
});

mainRouter.get('/user', async (req, res) => {
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

mainRouter.post('/submit', async (req, res) => {
  const unique_code = req.body.unique_code;
  const songs: {
    title: string;
    artist: string;
    spotify_link: string;
  }[] = req.body.songs;

  console.log(req.body.unique_code, req.body.songs);

  if (!unique_code || !songs) {
    return res.status(400).send({ status: 'bad request' });
  }

  if (songs.length !== 2) {
    return res.status(400).send({ status: '2 song submissions required' });
  }

  const queryRes = await query('SELECT * FROM person WHERE unique_code = $1', [
    unique_code
  ]);

  if (queryRes.rows.length == 0) {
    return res.status(404).send({ status: 'person not found' });
  }

  const person = queryRes.rows[0];

  if (person.submitted) {
    return res.status(400).send({ status: 'person already submitted' });
  }

  const duplicates = _.compact(
    await Promise.all(
      songs.map(async (song) => {
        const checkSongsDuplicateRes = await query(
          'SELECT * FROM song WHERE spotify_link = $1',
          [song.spotify_link]
        );
        const duplicate = checkSongsDuplicateRes.rows.length > 0;
        return duplicate ? song : undefined;
      })
    )
  );

  if (duplicates.length > 0) {
    return res.status(400).send({ status: 'duplicate song', duplicates });
  }

  const insertRes = await query(
    `INSERT INTO song (title, artist, spotify_link, user_id) VALUES ${songs
      .map(
        (s) =>
          `('${s.title}', '${s.artist}', '${s.spotify_link}', '${person.id}')`
      )
      .join(', ')}`,
    []
  );

  if (insertRes.rowCount != songs.length) {
    return res.status(500).send({ status: 'internal server error' });
  }

  await query('UPDATE person SET submitted = true WHERE id = $1', [person.id]);

  return res.status(200).send({ status: 'success' });
});

//Person can only vote twice
mainRouter.post('vote', async (req, res) => {
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

export default mainRouter;
