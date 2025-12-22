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
  ButtonBuilder,
  ButtonStyle,
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
                        .setURL("https://cdn.discordapp.com/attachments/1450882991751696494/1452713189551898846/banner1.png?ex=694ad016&is=69497e96&hm=68d8b6f2b7663bc0b2f2ea709e312c29e26ce97ca5d61e7cc08f85100c3774ce&"),
                    ),
                )
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent(`## 🎓 **เลือกมหาวิทยาลัย**\nเลือกมหาวิทยาลัยตามสถานศึกษาที่คุณกำลังศึกษาอยู่ เพื่อบ่งบอกว่าคุณมาจากที่ไหนและเป็นส่วนหนึ่งของสถาบันใด\nระบบจะทำการเปลี่ยนสีชื่อพร้อมมอบยศตามมหาวิทยาลัยต่าง ๆ โดยอัตโนมัติ\n`),
                )
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent("-# (คุณสามารถปรับเปลี่ยนหรือลบได้ตลอดเวลา)"),
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
                ),
            ];

            const yearsComponent = [
              new ContainerBuilder()
                .addMediaGalleryComponents(
                  new MediaGalleryBuilder()
                    .addItems(
                      new MediaGalleryItemBuilder()
                        .setURL("https://cdn.discordapp.com/attachments/1450882991751696494/1452713188985405470/banner2.png?ex=694ad016&is=69497e96&hm=94df09677a5172c6020fb4867b8326eac926c4e56cfa268e72205ade2855ef9a&"),
                    ),
                )
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent(`## ⌛ **เลือกชั้นปีการศึกษา**\nเลือกชั้นปีที่คุณกำลังศึกษาอยู่ เพื่อแสดงตัวตนและความเก๋าของคุณในเซิร์ฟเวอร์!\nระบบจะทำการมอบยศตามชั้นปีโดยอัตโนมัติ ช่วยให้สมาชิกคนอื่นรู้จักคุณได้ง่ายขึ้น\n`),
                )
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent("-# (คุณสามารถปรับเปลี่ยนหรือลบได้ตลอดเวลา)"),
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
                ),
            ];

            const interestsComponent = [
              new ContainerBuilder()
                .addMediaGalleryComponents(
                  new MediaGalleryBuilder()
                    .addItems(
                      new MediaGalleryItemBuilder()
                        .setURL("https://cdn.discordapp.com/attachments/1450882991751696494/1452713188566237276/banner3.png?ex=694ad016&is=69497e96&hm=f30b3de4f26a31517020861e33ae5dec0e1164f71dd038367b05e2d97c7e7a2c&"),
                    ),
                )
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent(`## 💖 **เลือกความสนใจของคุณ**\nเลือกสิ่งที่คุณสนใจจากรายการด้านล่าง\nระบบจะทำการมอบยศให้โดยอัตโนมัติ พร้อมปลดล็อกห้องพูดคุยและพื้นที่พิเศษที่เกี่ยวข้อง\nเพื่อให้คุณได้เข้าร่วมและพูดคุยกับสมาชิกที่มีความสนใจเดียวกัน`),
                )
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent("-# (คุณสามารถปรับเปลี่ยนหรือลบได้ตลอดเวลา)"),
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
                        .setCustomId("interest_roles")
                        .setPlaceholder("เลือกสิ่งที่คุณสนใจ")
                        .setMaxValues(config.roles.interests.length)
                        .addOptions(
                          // {
                          //   label: "รีเซ็ทสิ่งที่คุณสนใจ",
                          //   value: "interest_reset",
                          //   description: "ลบสิ่งที่คุณสนใจออก",
                          //   emoji: { name: "🗑️" },
                          // },
                          config.roles.interests.map((role: any) => {
                            return {
                              label: role.name,
                              value: `interest_${role.value}`,
                              description: role.desc,
                              emoji: { name: role.emoji },
                            };
                          }),
                        )
                    ),
                )
                .addActionRowComponents(
                  new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                      new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("ลบความสนใจทั้งหมด")
                        .setEmoji({ name: "🗑️" })
                        .setCustomId("interest_reset"),
                    ),
                ),
            ]

            await interaction.channel.send({
              components: uniComponent,
              flags: MessageFlags.IsComponentsV2,
            });

            await interaction.channel.send({
              components: yearsComponent,
              flags: MessageFlags.IsComponentsV2,
            });

            await interaction.channel.send({
              components: interestsComponent,
              flags: MessageFlags.IsComponentsV2,
            });

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