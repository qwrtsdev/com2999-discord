import {
    Client,
    Collection,
    GatewayIntentBits,
    ActivityType,
} from "discord.js";
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

interface ClientWithCommands extends Client {
  commands: Collection<string, any>;
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],

    presence: {
        activities: [
            {
                type: ActivityType.Custom,
                name: "custom",
                state: "❓ /help · COM2999",
            },
        ],
    },
}) as ClientWithCommands;

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'src', 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.ts'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    const commandModule = await import(
      pathToFileURL(filePath).href
    );

    const command = commandModule.default;

    if (command?.data && command?.execute) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `❌ The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, 'src', 'events');
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter(file => file.endsWith('.ts'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);

  const event = (await import(pathToFileURL(filePath).href)).default;

  if (!event?.name || !event.execute) {
    console.warn(`Invalid event file: ${file}`);
    continue;
  }

  if (event.once) {
    client.once(event.name, (...args: any[]) => event.execute(...args));
  } else {
    client.on(event.name, (...args: any[]) => event.execute(...args));
  }
}

client.login(process.env.BOT_TOKEN);
