import {
    Events,
    ChannelType,
    Guild,
} from "discord.js";
import config from "../config.json" with { type: "json" };

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
            config.voicechat.main, // join to create
            config.voicechat.border, // border
        ];

        try {
            if (
                (!oldState.channelId ||
                    oldState.channelId !== config.voicechat.main) &&
                newState.channelId === config.voicechat.main
            ) {
                try {
                    const channel = await newState.guild.channels.create({
                        name: `🔊・Party #${countVoiceChannels(newState.guild, newState.channel.parentId) - protectedChannels.length + 1}`,
                        type: ChannelType.GuildVoice,
                        parent: newState.channel.parent,
                    });

                    await newState.member.voice.setChannel(channel.id);

                } catch (error) {
                    console.error("[autoVC - create] error :", error);
                }
            }

            if (oldState.channel) {
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
