import { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  InteractionContextType, 
  ModalBuilder, 
  TextInputBuilder,
  TextInputStyle,
  LabelBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  FileUploadBuilder
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("msg")
    .setDescription("วางข้อความในแชท")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction: any) {
    const modal = new ModalBuilder().setCustomId("MessageModal").setTitle("วางข้อความในแชท");

    const messageInput = new LabelBuilder()
      .setLabel("เนื้อหาข้อความ")
      .setDescription("กรุณากรอกข้อความที่ต้องการส่ง (สามารถใช้ Markdown ได้)")
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId("msg_content")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
      )

    const image = new FileUploadBuilder()
      .setCustomId('msg_image')
      .setMinValues(0)
      .setMaxValues(1)
      .setRequired(false);
    const imageInput = new LabelBuilder()
      .setLabel("รูปภาพประกอบ (ถ้ามี)")
      .setDescription("อัปโหลดรูปภาพที่ต้องการแนบไปกับข้อความ")
      .setFileUploadComponent(image);

    const anonymousOption = new LabelBuilder()
      .setLabel("ระบุตัวตน")
      .setDescription("ต้องการระบุตัวตนลงในข้อความหรือไม่")
      .setStringSelectMenuComponent(
        new StringSelectMenuBuilder()
          .setCustomId("msg_anonymous")
          .setRequired(false)
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel("ใช่")
              .setValue("true"),
            new StringSelectMenuOptionBuilder()
              .setLabel("ไม่")
              .setValue("false"),
          )
      )

    modal.addLabelComponents(messageInput, imageInput, anonymousOption)
    await interaction.showModal(modal);
  }
}