import { 
  Events, 
  AttachmentBuilder, 
  MediaGalleryBuilder, 
  MediaGalleryItemBuilder, 
  TextDisplayBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ActionRowBuilder, 
  type MessageActionRowComponentBuilder, 
  ContainerBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
} from "discord.js";
import { request } from "undici";
import Canvas from "@napi-rs/canvas";
import config from "../config.json" with { type: "json" };
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    name: Events.GuildMemberAdd,
    once: false,

    async execute(member: any) {
        try {
            // create canvas with size
            const canvas = Canvas.createCanvas(1400, 500);
            const context = canvas.getContext("2d");

            // load bg
            const bgBuffer = fs.readFileSync(
                path.resolve(__dirname, "../../assets/bg.png")
            );
            const background = await Canvas.loadImage(bgBuffer);
            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            // load user avatar
            const avatarUrl = member.displayAvatarURL({
                extension: "jpg",
                size: 256 * 2,
            });
            const { body } = await request(avatarUrl);
            const avatar = await Canvas.loadImage(await body.arrayBuffer());

            // avatar image + stroke
            const avatarRadius = 135;
            const avatarX = 80;
            const avatarY = Math.round((canvas.height - avatarRadius * 2) / 2);
            context.save();
            context.beginPath();
            context.arc(
                avatarX + avatarRadius,
                avatarY + avatarRadius,
                avatarRadius,
                0,
                Math.PI * 2,
                true
            );
            context.closePath();
            context.clip();
            context.drawImage(
                avatar,
                avatarX,
                avatarY,
                avatarRadius * 2,
                avatarRadius * 2
            );
            context.restore();
            context.save();
            context.beginPath();
            context.arc(
                avatarX + avatarRadius,
                avatarY + avatarRadius,
                avatarRadius + 6,
                0,
                Math.PI * 2,
                true
            );
            context.strokeStyle = "#16197e";
            context.lineWidth = 15;
            context.stroke();
            context.restore();

            // custom font
            const customFont = path.resolve(
                __dirname,
                "../../assets/LINESeedSansTH_A_Bd.ttf"
            );
            Canvas.GlobalFonts.registerFromPath(customFont, "customFont");

            // ellipsis text
            function fitTextWithEllipsis(ctx: any, text: string, maxWidth: number): string {
                if (ctx.measureText(text).width <= maxWidth) return text;
                while (text.length > 0) {
                    text = text.slice(0, -1);
                    if (ctx.measureText(text + "...").width <= maxWidth) {
                        return text + "...";
                    }
                }
                return "...";
            }

            // text positioning
            const textX = avatarX + avatarRadius * 2 + 72;
            const textY = avatarY + 120;

            // text 1 (text)
            const memberCount = member.guild.memberCount;
            const memberFontSize = 50;
            const memberText = `สมาชิกคนที่ #${memberCount}`;
            context.font = `${memberFontSize}px customFont`;
            context.fillText(memberText, textX, textY - 25);

            // text 2 (username)
            const textFontSize = 120;
            const maxTextWidth = canvas.width - textX - 72;
            context.font = `${textFontSize}px customFont`;
            context.fillStyle = "#09090b";
            const helloText = `${member.displayName}`;
            const displayText = fitTextWithEllipsis(
                context,
                helloText,
                maxTextWidth
            );
            context.fillText(displayText, textX, textY + 89);

            // wave image
            const waveImgBuffer = fs.readFileSync(
                path.resolve(__dirname, "../../assets/wave.png")
            );
            const waveImg = await Canvas.loadImage(waveImgBuffer);
            const waveTargetHeight = 100;
            const waveScale = waveTargetHeight / 160;
            const waveTargetWidth = 160 * waveScale;
            const waveX = avatarX + avatarRadius * 2 - waveTargetWidth + 10;
            const waveY = avatarY + avatarRadius * 2 - waveTargetHeight + 10;
            context.drawImage(
                waveImg,
                waveX,
                waveY,
                waveTargetWidth,
                waveTargetHeight
            );

            const attachment = new AttachmentBuilder(
                await canvas.encode("png"),
                { name: `${member.id}-join-image.png` }
            );

            const channel = member.guild.channels.cache.get(config.channels.welcome);
            await channel.send({
                content: `👋🏻 <@${member.id}> ยินดีต้อนรับ!`,
                files: [attachment],
            });

            const messageFile = await Bun.file("../templates/join-msg.txt").text();

            const dmComponent = [
              new ContainerBuilder()
                .addMediaGalleryComponents(
                  new MediaGalleryBuilder()
                    .addItems(
                      new MediaGalleryItemBuilder()
                          .setURL("https://media.discordapp.net/attachments/1450882991751696494/1451590219915591711/591126506_17866124577521767_1456465835305861206_n.jpg?ex=6946ba3d&is=694568bd&hm=8b4a6ddfa27a9bcfdeb4543cfeda3415a8c5b66a26a0cd76c8495fbde3a54d7a&=&format=webp&width=1215&height=385"),
                    ),
                )
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent(messageFile),
                )
                .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
                .addActionRowComponents(
                  new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                      new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel("ไปที่แชทหลัก")
                        .setURL("https://discord.com/channels/1450516106161819753/1450516107575427175"),
                      new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel("ติดตามบน Instagram")
                        .setURL("https://www.instagram.com/comsampan.eng/"),
                      ),
                ),
            ]

            try { 
              await member.user.send({ components: dmComponent, });
              console.log(`[dm success] to user : ${member.user.tag}`);
            } catch (error) {
              console.error("[dm error] error :", error);
            }
        } catch (error) {
            console.error("[join log] error :", error);
        }
    },
};
