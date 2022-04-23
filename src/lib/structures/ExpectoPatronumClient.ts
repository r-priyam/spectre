import { LogLevel, SapphireClient } from '@sapphire/framework';
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis';
import { Time } from '@sapphire/time-utilities';
import { GatewayIntentBits } from 'discord-api-types/v9';

import { Config } from '#root/config';

export class ExpectoPatronumClient extends SapphireClient {
	public constructor() {
		super({
			shards: 'auto',
			defaultPrefix: ['!', '.', '?'],
			caseInsensitiveCommands: true,
			logger: { level: Config.isDebug ? LogLevel.Debug : LogLevel.Info },
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildBans,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMessageReactions
			],
			presence: {
				activities: [
					{
						name: Config.bot.activityMessage,
						type: 'PLAYING'
					}
				]
			},
			loadMessageCommandListeners: true,
			loadDefaultErrorListeners: false,
			hmr: {
				enabled: Config.isDevelopment,
				usePolling: true,
				// Delay hmr by 3 seconds
				interval: Time.Second * 3
			},
			tasks: {
				strategy: new ScheduledTaskRedisStrategy({
					bull: {
						redis: {
							host: Config.database.redis.host,
							db: Config.database.redis.tasksDb
						}
					}
				})
			}
		});
	}
}
