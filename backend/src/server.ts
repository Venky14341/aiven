import app from './app';
import { config } from './config/env';

const host = process.env.HOST || '0.0.0.0';

app.listen(config.port, host, () => {
  console.log(`Investment research API running on http://${host}:${config.port}`);
});
