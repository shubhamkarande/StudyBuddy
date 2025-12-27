import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import planRoutes from './routes/plan.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const fastify = Fastify({
    logger: true,
});

// Main function to handle async setup
async function main() {
    // Register CORS
    await fastify.register(cors, {
        origin: true,
    });

    // Register routes
    await fastify.register(planRoutes, { prefix: '/plan' });
    await fastify.register(statsRoutes, { prefix: '/stats' });

    // Health check
    fastify.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // Start server
    try {
        const port = parseInt(process.env.PORT || '3001', 10);
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`🚀 StudyBuddy API running on port ${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

main();
