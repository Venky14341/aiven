import app from './app';
import { config } from './config/env';
import { sequelize } from './config/database';

const host = process.env.HOST || '0.0.0.0';

sequelize.authenticate()
  .then(() => {
    console.log('Connected to MySQL');
    return sequelize.sync(); // creates tables if they don't exist
  })
  .then(() => {
    app.listen(config.port, host, () => {
      console.log(`Investment research API running on http://${host}:${config.port}`);
    });
  })
  .catch((err) => {
    console.error('MySQL connection error:', err);
    process.exit(1);
  });
