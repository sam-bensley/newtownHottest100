import express = require('express');
import mainRouter from './routes';

var cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', mainRouter);

export { app };
