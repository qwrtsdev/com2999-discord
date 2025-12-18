import { Events, ChannelType, Guild } from "discord.js";
import config from "../config.json" with { type: "json" };

const channelOwners = new Map<string, string>(); // channelId -> userId

function countVoiceChannels(guild: Guild, categoryId: string): number {
  return guild.channels.cache.filter((channel: any) =>
    channel.parentId === categoryId &&
    channel.type === ChannelType.GuildVoice
  ).size;
}

export default {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute(oldState: any, newState: any) {
    const protectedChannels = [
      config.voicechat.main,
      config.voicechat.border,
    ];

    try {
      if (
        (!oldState.channelId || oldState.channelId !== config.voicechat.main) && 
        newState.channelId === config.voicechat.main
      ) {
        try {
          const channel = await newState.guild.channels.create({
            name: `🔊・Party #${countVoiceChannels(newState.guild, newState.channel.parentId) - protectedChannels.length + 1}`,
            type: ChannelType.GuildVoice,
            parent: newState.channel.parent,
            position: countVoiceChannels(newState.guild, newState.channel.parentId) - protectedChannels.length + 1,
            bitrate: config.voicechat.defaultConfig.bitrate,
            userLimit: config.voicechat.defaultConfig.userLimit,

            permissionOverwrites: [
              // {
              //   id: newState.member.user.id,
              //   allow: ['Connect'],
              // },
              {
                id: newState.guild.roles.everyone,
                deny: ['CreateInstantInvite'],
              }
            ]
          });

          channelOwners.set(channel.id, newState.member.user.id);

          const mainChannel = await newState.client.channels.fetch(config.voicechat.main);
          await mainChannel.permissionOverwrites.edit(newState.member!.id, { Connect: false });

          await newState.member.voice.setChannel(channel.id);
        } catch (error) {
          console.error("[autoVC - create] error :", error);
        }
      }

      if (oldState.channel) {
        const userId = oldState.member.user.id;
        const channelId = oldState.channel.id;

        if (channelOwners.get(channelId) === userId) {
          try {
            const mainChannel = await oldState.client.channels.fetch(config.voicechat.main);
            await mainChannel.permissionOverwrites.delete(userId);
            
            channelOwners.delete(channelId);
          } catch (error) {
            console.error("[autoVC - unlock] error :", error);
          }
        }

        if (
          !protectedChannels.includes(oldState.channel.id) && 
          oldState.channel.members.size === 0
        ) {
          try {
            await oldState.channel.delete();
          } catch (error) {
            console.error("[autoVC - remove] error :", error);
          }
        }
      }
    } catch (error) {
      console.error("[autoVC] error :", error);
    }
  },
};