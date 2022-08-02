import { app } from './app';
import { APPDataSource } from './database/data-source';

APPDataSource.initialize().then(() => {
  app.listen(3001, () =>
    console.log(
      'Server is running! 🏆 Open http://localhost:3001 to see results',
    ),
  );
});
