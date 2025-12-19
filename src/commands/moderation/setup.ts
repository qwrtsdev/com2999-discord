import { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  InteractionContextType, 
  MessageFlags,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  TextDisplayBuilder, 
  ActionRowBuilder,
  StringSelectMenuBuilder,
  SeparatorBuilder, 
  SeparatorSpacingSize,
  type MessageActionRowComponentBuilder,
} from "discord.js";
import config from "../../config.json" with { type: "json" };

export default {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("เปิดเมนูตั้งค่า")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction: any) {
    try {
      const component: any = [
        new ContainerBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              "## ⚙️ เมนูตั้งค่าเซิร์ฟเวอร์\nโปรดเลือกการตั้งค่าที่ต้องการดำเนินการด้านล่าง"
            )
          )
          .addActionRowComponents(
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId("setup_choices")
                .setPlaceholder("เลือกการตั้งค่า")
                .addOptions(
                  { label: "หน้าต่างการเลือกยศ", value: "setup_roles" },
                )
            )
          )
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              "-# โปรดดำเนินการภายใน 10 วินาทีก่อนหมดอายุ"
            )
          )
      ];

      const response = await interaction.reply({
        components: component,
        flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
      });

      const collectorFilter = (i: any) => i.user.id === interaction.user.id;

      try {
        const selection = await response.awaitMessageComponent({
          filter: collectorFilter,
          time: 10_000,
        });

        const selectedValue = selection.values[0];

        switch (selectedValue) {
          case "setup_roles": {
            await selection.update({
              components: [
                new ContainerBuilder().addTextDisplayComponents(
                  new TextDisplayBuilder().setContent(
                    "⏳ กำลังสร้างหน้าต่างเลือกยศ..."
                  )
                )
              ]
            });

            const uniComponent = [
              new ContainerBuilder()
                .addMediaGalleryComponents(
                  new MediaGalleryBuilder()
                    .addItems(
                      new MediaGalleryItemBuilder()
                        .setURL("https://cdn.discordapp.com/attachments/1450882991751696494/1450898265724948695/role.png?ex=694435ce&is=6942e44e&hm=504c045e319d0680b48c517244a04ab7287af55141c86b7f78ad4b70e58fa55c"),
                    ),
                )
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent(`## ➡️ **เลือกมหาวิทยาลัย**\nเลือกมหาวิทยาลัยตามสถานศึกษาที่คุณอยู่เพื่อบ่งบอกตัวตนของคุณว่ามาจากที่ไหน\nระบบจะทำการเปลี่ยนสีของชื่อ พร้อมมอบยศตามมหาวิทยาลัยต่างๆ\n`),
                )
                .addSeparatorComponents(
                  new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large)
                    .setDivider(true)
                )
                .addActionRowComponents(
                  new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                      new StringSelectMenuBuilder()
                        .setCustomId("uni_roles")
                        .setPlaceholder("เลือกมหาวิทยาลัยของคุณ")
                        .addOptions(
                          {
                            label: "รีเซ็ทมหาวิทยาลัย",
                            value: "uni_reset",
                            description: "ลบมหาวิทยาลัยที่มีออก",
                            emoji: { name: "🗑️" },
                          },
                          ...config.roles.universities.map((role: any) => {
                            return {
                              label: role.name,
                              value: `uni_${role.value}`,
                              description: role.desc,
                              emoji: { name: role.emoji_id, id: role.emoji_id },
                            };
                          }),
                        ),
                    ),
                )
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent("-# (คุณสามารถปรับเปลี่ยนหรือลบได้ตลอดเวลา)"),
                ),
            ];

            const yearsComponent = [
              new ContainerBuilder()
                .addMediaGalleryComponents(
                  new MediaGalleryBuilder()
                    .addItems(
                      new MediaGalleryItemBuilder()
                        .setURL("https://cdn.discordapp.com/attachments/1450882991751696494/1450899767365341306/year.png?ex=69443734&is=6942e5b4&hm=7c3dddfe8fd6ace55cafe440abdc70bd8be67f554b8cd074bdb0450f6a885e52"),
                    ),
                )
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent(`## ➡️ **เลือกชั้นปีการศึกษา**\nเลือกชั้นปีที่คุณเรียนอยู่ เพื่อแสดงความเก๋าของคุณ!\nระบบจะทำการมอบยศตามชั้นปีต่างๆ\n`),
                )
                .addSeparatorComponents(
                  new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large)
                    .setDivider(true)
                )
                .addActionRowComponents(
                  new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                      new StringSelectMenuBuilder()
                        .setCustomId("year_roles")
                        .setPlaceholder("เลือกชั้นปีของคุณ")
                        .addOptions(
                          {
                            label: "รีเซ็ทชั้นปี",
                            value: "year_reset",
                            description: "ลบชั้นปีที่มีออก",
                            emoji: { name: "🗑️" },
                          },
                          ...config.roles.years.map((role: any) => {
                            return {
                              label: role.name,
                              value: `year_${role.value}`,
                              description: role.desc,
                              emoji: { name: role.emoji },
                            };
                          }),
                        ),
                    ),
                )
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent("-# (คุณสามารถปรับเปลี่ยนหรือลบได้ตลอดเวลา)"),
                ),
            ];

            await interaction.channel.send({
              components: uniComponent,
              flags: MessageFlags.IsComponentsV2,
            });

            await interaction.channel.send({
              components: yearsComponent,
              flags: MessageFlags.IsComponentsV2,
            });

            // Update with success message
            const successComponent: any = [
              new ContainerBuilder().addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  `### ✅ ดำเนินการ \`\`${selectedValue}\`\` สำเร็จแล้ว`
                )
              ),
            ];

            await selection.update({ components: successComponent });

            break;
          }

          default: 
            break;
        }

      } catch (e) {
        console.error("Selection error:", e);
        
        const timeoutComponent: any = [
          new ContainerBuilder().addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              "### ⏱️ หมดเวลา\nโปรดใช้คำสั่ง `/setup` อีกครั้ง"
            )
          ),
        ];

        await interaction.editReply({ components: timeoutComponent });
      }

    } catch (error) {
      console.error('Error in setup command:', error);
      
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ 
            content: "❌ เกิดข้อผิดพลาดในการดำเนินการ", 
            flags: MessageFlags.Ephemeral
          });
        } else {
          await interaction.reply({ 
            content: "❌ เกิดข้อผิดพลาดในการดำเนินการ", 
            flags: MessageFlags.Ephemeral
          });
        }
      } catch (replyError) {
        console.error("Failed to send error message:", replyError);
      }
    }
  }
}