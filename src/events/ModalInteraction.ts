import {
    Events,
    MessageFlags,
    ContainerBuilder,
    TextDisplayBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
} from "discord.js";

export default {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction: any) {
    if (!interaction.isModalSubmit()) return;

    switch (interaction.customId) {
      case "MessageModal":
        const message = interaction.fields.getTextInputValue("msg_content");
        const image = interaction.fields.getUploadedFiles('msg_image') || null;
        const anonymous = interaction.fields.getStringSelectValues("msg_anonymous");

        const container = new ContainerBuilder();

        if (image) { 
          const firstImage = image.entries().next().value;
          
          container.addMediaGalleryComponents(
            new MediaGalleryBuilder()
              .addItems(
                new MediaGalleryItemBuilder()
                  .setURL(firstImage[1].url),
              ),
          );
        }

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(message));

        if (anonymous === "true") { container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`ประกาศโดย ${interaction.user.username}`)); }

        const component = [container];
        await interaction.channel.send({
          components: component,
          flags: MessageFlags.IsComponentsV2
        });

        await interaction.reply({ 
          content: "ส่งข้อความเรียบร้อยแล้ว!", 
          flags: MessageFlags.Ephemeral
        }); 

        break;


      default: break;
    }
  }
}