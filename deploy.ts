import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands: any[] = [];

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
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!BOT_TOKEN || !CLIENT_ID || !GUILD_ID) {
  throw new Error('Missing required environment variables');
}

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data: any = await rest.put(
      Routes.applicationGuildCommands(
        CLIENT_ID,
        GUILD_ID
      ),
      { body: commands }
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
