import {
    Events,
    MessageFlags,
    ContainerBuilder,
    TextDisplayBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
} from "discord.js";

export default {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction: any) {
    if (!interaction.isModalSubmit()) return;

    switch (interaction.customId) {
      case "MessageModal":
        const message: string = interaction.fields.getTextInputValue("msg_content");
        const image: Map<string, any> | null = interaction.fields.getUploadedFiles('msg_image') || null;
        const anonymous: string | null = interaction.fields.getStringSelectValues("msg_anonymous") || null;

        const container = new ContainerBuilder();

        if (image) { 
          const picture = image.entries().next().value;

          if (picture) {
            container.addMediaGalleryComponents(
              new MediaGalleryBuilder()
                .addItems(
                  new MediaGalleryItemBuilder()
                    .setURL(picture[1].url),
                ),
            );
          }
        }

        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(message));

        if (anonymous && anonymous == "true") { 
          container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
          container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ประกาศโดย <@${interaction.user.id}>`)); 
        }

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