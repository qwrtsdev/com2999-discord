import { Events } from "discord.js";

export default {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction: any) {
    if (!interaction.isButton()) return;
    
    const interactedChannel = interaction.channel;
    const interactedUser = interaction.user;

    if (interaction.customId.startsWith("vc_config_")) {
      await interaction.channel.send({
        content: `🔧 <@${interactedUser.id}> กำลังตั้งค่าห้องเสียงของคุณ...`,
      });
    }
  }
}