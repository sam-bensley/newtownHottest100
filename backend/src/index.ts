import { app } from './app';

const PORT = 8080;

(async function start() {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
