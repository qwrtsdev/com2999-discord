import { 
  Events, 
  MessageFlags,
  TextDisplayBuilder,
  ContainerBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import { channelOwners } from '../utils/channelStates';
import config from "../config.json" with { type: "json" };

export default {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction: any) {
    if (!interaction.isButton()) return;
    
    const interactedChannel = interaction.channel;
    const interactedUser = interaction.user;

    if (interaction.customId.startsWith("vcconfig_")) {
      const configType = interaction.customId.split("_")[1];

      switch (configType) {
        case "giveaway": {
          const ownerId = channelOwners.get(interactedChannel.id);

          if (ownerId !== interactedUser.id) {
            return interaction.reply({
              content: "❌ คุณไม่ใช่เจ้าของห้องนี้",
              MessageFlags: MessageFlags.Ephemeral,
            });
          }
          
          const claimComponent = [
            new ContainerBuilder()
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**🎉 ห้องนี้ไม่มีเจ้าของแล้ว** คุณสามารถกดปุ่มเพื่อเคลมความเป็นเจ้าของห้องนี้ได้`),
              ),
              new ActionRowBuilder<MessageActionRowComponentBuilder>()
                .addComponents(
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("ขอเป็นเจ้าของห้อง")
                    .setEmoji({
                      name: "🎁",
                    })
                    .setCustomId("vcconfig_claim"),
                ),
          ];

          try {
            await interaction.update({
              components: claimComponent,
              flags: MessageFlags.IsComponentsV2,
            });

            await interactedChannel.send({
              content: `🔓 <@${interactedUser.id}> ปลดความเป็นเจ้าของห้องนี้แล้ว!`,
            });
          } catch (error) {
            console.error("[vcconfig_giveaway] error:", error);

            await interaction.reply({
              content: "❌ เกิดข้อผิดพลาดในการยกเลิกความเป็นเจ้าของห้อง",
              MessageFlags: MessageFlags.Ephemeral,
            });
          }

          break;
        }

        case "claim": {
          const currentOwnerId = channelOwners.get(interactedChannel.id);

          if (!currentOwnerId) {
            return interaction.reply({
              content: "❌ ห้องนี้ไม่มีข้อมูลเจ้าของ",
              MessageFlags: MessageFlags.Ephemeral,
            });
          }

          try {
            const member = await interaction.guild.members.fetch(interactedUser.id);
            
            if (!member.voice.channel || member.voice.channel.id !== interactedChannel.id) {
              return interaction.reply({
                content: "❌ คุณต้องอยู่ในห้องนี้เพื่อเป็นเจ้าของ",
                MessageFlags: MessageFlags.Ephemeral,
              });
            }

            const mainChannel = await interaction.client.channels.fetch(config.voicechat.main);
            await mainChannel.permissionOverwrites.delete(currentOwnerId);

            channelOwners.set(interactedChannel.id, interactedUser.id);
            await mainChannel.permissionOverwrites.edit(interactedUser.id, { Connect: false });

            const ownerComponent = [
              new ContainerBuilder()
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent(`**⚠️ ขณะนี้ ห้องนี้เป็นของ <@${interactedUser.id}>** คุณจะไม่สามารถสร้างห้องใหม่ได้ จนกว่าจะปลดการเป็นเจ้าของห้องนี้หรือห้องจะหายไปเนื่องจากไม่มีสมาชิกเหลืออยู่`),
                ),
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                  .addComponents(
                    new ButtonBuilder()
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("ถอนความเป็นเจ้าของ")
                      .setEmoji({
                        name: "🔓",
                      })
                      .setCustomId("vcconfig_giveaway"),
                  ),
            ];

            await interaction.update({
              components: ownerComponent,
              flags: MessageFlags.IsComponentsV2,
            });

            await interactedChannel.send({
              content: `🎉 <@${interactedUser.id}> เป็นเจ้าของห้องนี้แล้ว!`,
            });

          } catch (error) {
            console.error("[vcconfig_claim] error:", error);

            await interaction.reply({
              content: "❌ เกิดข้อผิดพลาดในการขอเป็นเจ้าของห้อง",
              MessageFlags: MessageFlags.Ephemeral,
            });
          }

          break;
        }

        default: break;
      }
    }
  }
}