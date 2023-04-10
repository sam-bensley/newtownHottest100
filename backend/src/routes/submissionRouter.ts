import * as Express from 'express';
import _ from 'lodash';
import { query } from '../db';

const submissionRouter = Express.Router();

const MAX_SONGS = 2;

submissionRouter.post('/submit', async (req, res) => {
  const unique_code = req.body.unique_code;
  const songs: {
    title: string;
    artist: string;
    spotify_link: string;
  }[] = req.body.songs;

  if (!unique_code || !songs) {
    return res.status(400).send({ status: 'bad request' });
  }

  if (songs.length !== MAX_SONGS) {
    return res
      .status(400)
      .send({ status: `${MAX_SONGS} song submissions required` });
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
          `('${s.title.replace(/'/g, "''")}', '${s.artist.replace(
            /'/g,
            "''"
          )}', '${s.spotify_link.replace(/'/g, "''")}', '${person.id}')`
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

export default submissionRouter;
