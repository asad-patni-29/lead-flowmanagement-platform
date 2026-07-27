import app from './app';
import { config } from './config/env';
import { connectDatabase } from './config/database';

const startServer = async (): Promise<void> => {
  try {
    try {
      await connectDatabase();
    } catch (dbError) {
      console.warn('⚠️  Starting server without database connection');
      console.warn('   Install MongoDB or use MongoDB Atlas for full functionality');
    }

    const server = app.listen(config.PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚀 Server is running!                               ║
║                                                        ║
║   📡 Port: ${config.PORT}                                      ║
║   🌍 Environment: ${config.NODE_ENV}                        ║
║   🔗 API: http://localhost:${config.PORT}/api                ║
║   ❤️  Health: http://localhost:${config.PORT}/api/health     ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
      `);
    });

    const gracefulShutdown = (signal: string) => {
      console.log(`\n${signal} received. Closing server gracefully...`);
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
