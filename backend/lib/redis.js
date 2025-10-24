import Redis from "ioredis";

let redisClient = null;

// Lazy initialization of Redis client
export const redis = new Proxy({}, {
	get(target, prop) {
		if (!redisClient) {
			const redisUrl = process.env.UPSTASH_REDIS_URL;
			
			if (!redisUrl) {
				throw new Error('UPSTASH_REDIS_URL is not defined in environment variables');
			}
			
			redisClient = new Redis(redisUrl, {
				tls: {
					rejectUnauthorized: false,
					minVersion: 'TLSv1.2',
				},
				maxRetriesPerRequest: 3,
				enableOfflineQueue: false,
				connectTimeout: 10000,
				retryStrategy(times) {
					if (times > 10) {
						return null;
					}
					const delay = Math.min(times * 50, 2000);
					return delay;
				},
				reconnectOnError(err) {
					const targetError = 'READONLY';
					if (err.message.includes(targetError)) {
						return true;
					}
					return false;
				}
			});

			redisClient.on('error', (err) => {
				console.error('Redis connection error:', err.message);
			});

			redisClient.on('connect', () => {
				console.log('✅ Redis connected successfully');
			});
		}
		return redisClient[prop];
	}
});
