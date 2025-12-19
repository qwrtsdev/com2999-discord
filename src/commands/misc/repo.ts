import { SlashCommandBuilder, MessageFlags } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("repo")
    .setDescription("แสดงลิงก์ไปยัง GitHub Repository"),
  async execute(interaction: any) {
    await interaction.reply({ 
      content: "https://github.com/qwrtsdev/com2999-discord",
      flags: MessageFlags.Ephemeral,
    });
  },
};
