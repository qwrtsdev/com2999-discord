import { Events } from "discord.js";
import config from "../config.json" with { type: "json" };

export default {
    name: Events.GuildMemberRemove,
    once: false,

    async execute(member: any) {
      const channel = member.guild.channels.cache.get(config.channels.welcome);
      await channel.send({ content: `😭 <@${member.id}> ออกไปแล้ว 💨`, });
    }
};
