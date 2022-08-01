import { app } from './app';
import { APPDataSource } from './database/datesource';

APPDataSource.initialize().then(() => {
  app.listen(3001, () =>
    console.log(
      'Server is running! 🏆 Open http://localhost:3001/usuarios to see results',
    ),
  );
});
