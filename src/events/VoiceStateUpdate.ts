import { 
  Events, 
  ChannelType, 
  Guild, 
  TextDisplayBuilder, 
  ContainerBuilder,
  MessageFlags,
  ButtonBuilder,
  ButtonStyle, 
  ActionRowBuilder, 
  type MessageActionRowComponentBuilder,
} from "discord.js";
import config from "../config.json" with { type: "json" };
import { channelOwners } from '../utils/channelStates';

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

          const mainChannel = await newState.client.channels.fetch(config.voicechat.main);
          await mainChannel.permissionOverwrites.edit(newState.member!.id, { Connect: false });

          await newState.member.voice.setChannel(channel.id);
          await channelOwners.set(channel.id, newState.member.user.id);

          const channelComponent = [
            new ContainerBuilder()
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**⚠️ ขณะนี้ ห้องนี้เป็นของ <@${newState.member.user.id}>** คุณจะไม่สามารถสร้างห้องใหม่ได้ จนกว่าจะปลดการเป็นเจ้าของห้องนี้หรือห้องจะหายไปเนื่องจากไม่มีสมาชิกเหลืออยู่`),
              ),
              new ActionRowBuilder<MessageActionRowComponentBuilder>()
                .addComponents(
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("ถอนความเป็นเจ้าของ")
                    .setEmoji({
                      name: "🔓",
                    })
                    .setCustomId(`vcconfig_giveaway_${channel.id}`),
                ),
          ]

          channel.send({
            components: channelComponent,
            flags: MessageFlags.IsComponentsV2,
          });
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
            const mainChannel = await oldState.client.channels.fetch(config.voicechat.main);
            
            await oldState.channel.delete();
            await mainChannel.permissionOverwrites.delete(userId);
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