import { type TelegramContext, TelegramInboundResultOrPromise, type TelegramMessage, telegramChannel } from 'eve/channels/telegram';

export default telegramChannel({
  botUsername: process.env.TELEGRAM_BOT_USERNAME,
  credentials: { botToken: () => process.env.TELEGRAM_BOT_TOKEN! }
});
