import * as Express from 'express';
import submissionRouter from './submissionRouter';
import votingRouter from './votingRouter';
import userRouter from './userRouter';
import songRouter from './songRouter';

const mainRouter = Express.Router();

//health check
mainRouter.get('/', (req, res) => {
  res.status(200).send('healthy');
});

mainRouter.use('/submission', submissionRouter);
mainRouter.use('/voting', votingRouter);
mainRouter.use('/user', userRouter);
mainRouter.use('/songs', songRouter);

export default mainRouter;
