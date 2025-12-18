import { Events, MessageFlags } from "discord.js";
import config from "../config.json" with { type: "json" };

export default {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction: any) {
    if (!interaction.isStringSelectMenu()) return;
    
    const member = interaction.member;

    if (interaction.customId == "uni_roles") {
      const selectedValue = interaction.values[0];

      if (selectedValue == "uni_reset") {
        const allUniRoleIds = config.roles.universities.map((role: any) => role.role_id);
        const rolesToRemove = allUniRoleIds.filter((roleId: string) => member.roles.cache.has(roleId));

        try {
          if (rolesToRemove.length > 0) { await member.roles.remove(rolesToRemove); }
          
          await interaction.reply({
            content: "## 🗑️ คุณได้ทำการรีเซ็ทมหาวิทยาลัยเรียบร้อยแล้ว",
            flags: MessageFlags.Ephemeral
          });
        } catch (error) {
          console.error(error);

          await interaction.reply({
            content: "❌ ไม่สามารถรีเซ็ทมหาวิทยาลัยได้ กรุณาลองใหม่อีกครั้ง",
            flags: MessageFlags.Ephemeral
          });
        }

        return;
      }

      const valueWithoutPrefix = selectedValue.replace("uni_", "");
      const selectedRole = config.roles.universities.find((role: any) => role.value === valueWithoutPrefix);
      
      if (!selectedRole) {
        await interaction.reply({
          content: "❌ ไม่พบมหาลัยที่เลือก กรุณาลองใหม่อีกครั้ง",
          flags: MessageFlags.Ephemeral
        });

        return;
      }

      const selectedRoleId = selectedRole.role_id;
      const allUniRoleIds = config.roles.universities.map((role: any) => role.role_id);
      const rolesToRemove = allUniRoleIds.filter((roleId: string) => roleId !== selectedRoleId && member.roles.cache.has(roleId));
      
      try {
        if (rolesToRemove.length > 0) { await member.roles.remove(rolesToRemove); }
        if (!member.roles.cache.has(selectedRoleId)) { await member.roles.add(selectedRoleId); }
        
        await interaction.reply({
          content: `## <:${selectedRole.emoji_id}:${selectedRole.emoji_id}> คุณเลือกมหาลัย \`${selectedRole.name}\` แล้ว`,
          flags: MessageFlags.Ephemeral
        });
      } catch (error) {
        console.error(error);

        await interaction.reply({
          content: "❌ ไม่สามารถอัปเดตมหาลัยได้ กรุณาลองใหม่อีกครั้ง",
          flags: MessageFlags.Ephemeral
        });
      }
    }

    if (interaction.customId == "year_roles") {
      const selectedValue = interaction.values[0];

      if (selectedValue == "year_reset") {
        const allYearRoleIds = config.roles.years.map((role: any) => role.role_id);
        const rolesToRemove = allYearRoleIds.filter((roleId: string) => member.roles.cache.has(roleId));

        try {
          if (rolesToRemove.length > 0) { await member.roles.remove(rolesToRemove); }
          
          await interaction.reply({
            content: "## 🗑️ คุณได้ทำการรีเซ็ทปีการศึกษาเรียบร้อยแล้ว",
            flags: MessageFlags.Ephemeral
          });
        } catch (error) {
          console.error(error);

          await interaction.reply({
            content: "❌ ไม่สามารถรีเซ็ทปีการศึกษาได้ กรุณาลองใหม่อีกครั้ง",
            flags: MessageFlags.Ephemeral
          });
        }

        return;
      }

      const valueWithoutPrefix = selectedValue.replace("year_", "");
      const selectedRole = config.roles.years.find((role: any) => role.value === valueWithoutPrefix);
      
      if (!selectedRole) {
        await interaction.reply({
          content: "❌ ไม่พบปีการศึกษาที่เลือก กรุณาลองใหม่อีกครั้ง",
          flags: MessageFlags.Ephemeral
        });

        return;
      }

      const selectedRoleId = selectedRole.role_id;
      const allYearRoleIds = config.roles.years.map((role: any) => role.role_id);
      const rolesToRemove = allYearRoleIds.filter((roleId: string) => roleId !== selectedRoleId && member.roles.cache.has(roleId));
      
      try {
        if (rolesToRemove.length > 0) { await member.roles.remove(rolesToRemove); }
        if (!member.roles.cache.has(selectedRoleId)) { await member.roles.add(selectedRoleId); }
        
        await interaction.reply({
          content: `## ${selectedRole.emoji} คุณเลือกปีการศึกษา \`${selectedRole.name}\` แล้ว`,
          flags: MessageFlags.Ephemeral
        });
      } catch (error) {
        console.error(error);
        
        await interaction.reply({
          content: "❌ ไม่สามารถอัปเดตปีการศึกษาได้ กรุณาลองใหม่อีกครั้ง",
          flags: MessageFlags.Ephemeral
        });
      }
    }
  }
}