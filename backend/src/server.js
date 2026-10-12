import { createApp } from './app.js';
import { createPool } from './db.js';
import { config } from './config.js';

const db = createPool();
const app = createApp({ db });

app.listen(config.port, () => {
  console.log(`MoneyMind API escuchando en http://localhost:${config.port}`);
});
