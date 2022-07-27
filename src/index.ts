import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits, Partials, Events, ApplicationCommandType, UserContextMenuCommandInteraction } from "discord.js";
import { createCanvas, registerFont, loadImage } from "canvas";
import axios from "axios";
import path from "node:path";
import * as StackBlur from "stackblur-canvas";

registerFont(path.join(__dirname, "..", "assets/mplusblack.ttf"), { family: "M PLUS Rounded 1c" });

const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.User, Partials.Message], rest: { offset: 0 } });

client.on(Events.ClientReady, (cl) => {
  cl.user.setActivity({ name: "Apps -> インターネットやめろ" });
  console.log(`${cl.user.tag} Ready!`);
  cl.application.commands.set([
    {
      name: "インターネットやめろ",
      type: ApplicationCommandType.User
    }
  ], process.env.NODE_ENV === "development" ? process.env.TEST_GUILD_ID! : undefined as unknown as string);
});

client.on(Events.InteractionCreate, async (i) => {
  if (!i.isUserContextMenuCommand()) return;
  await i.deferReply();
  const avatarUrl = i.targetUser.displayAvatarURL({ extension: "png", size: 512 });
  const avatar = await axios.get<Buffer>(avatarUrl, { responseType: "arraybuffer" });
  const dst = createCanvas(512, 512);
  const ctx = dst.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 512);

  (async () => {
    ctx.beginPath();
    ctx.arc(256, 256, 512 / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#0f94cc";
    ctx.fill();
    const d = "インターネットやめろ".split("");
    const t3 = 256 * 0.13 * 0.47;
    const radius = 256 * (1 - 0.13) + 9;
    const w = Math.floor(2 * radius * Math.PI / (t3 + 2));
    const r = Math.max(0, Math.floor(w / d.length));
    ctx.font = `${t3 / 1.33}pt 'M PLUS Rounded 1c', sans-serif`;
    ctx.fillStyle = "#ffffff";
    for (let t = 0; t < r; t++) {
      for (let i = 0; i < d.length; i++) {
        const headingRad = 2 * Math.PI * (t * d.length + i) / (d.length * r) + Math.PI * (9 / 180);
        ctx.save();
        ctx.translate(256, 256);
        ctx.rotate(headingRad);
        ctx.textAlign = "center";
        ctx.fillText(d[i], 0, -radius);
        ctx.restore();
      }
    }
    (async () => {
      const canvas2 = createCanvas(512, 512)
      const context = canvas2.getContext("2d");
      const defaultWidth = 512 * (1 - 0.13);
      const defaultHeight = 512 * (1 - 0.13);
      const img = await loadImage(avatar.data)
      let width;
      let height;
      if (img.width > img.height) {
        width = img.width * (defaultHeight / img.height);
        height = defaultHeight;
      } else {
        width = defaultWidth;
        height = img.height * (defaultWidth / img.width);
      }
      context.drawImage(img, 0, 0, img.width, img.height, (defaultWidth - width) / 2 + 512 / 2 * 0.13, (defaultHeight - height) / 2 + 512 / 2 * 0.13, width, height);
      context.save();
      context.globalCompositeOperation = "destination-in";
      context.beginPath();
      context.arc(256, 256, 512 / 2 * (1 - 0.13), 0, 2 * Math.PI);
      context.fill();
      context.restore();
      ctx.drawImage(canvas2, 0, 0);
      makeBorder();
    })();
  })();
  async function makeBorder() {
    const faviconImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAEsCAYAAAACUNnVAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAnZJREFUeNrF1GlLlUEYxvH5Ai5nedyXTEkri4SULJQUNFLQSAklDmVkpZWIVkopaWWiJFa2mmRhpYURp9T0uJ7F4/Klpuv/GXrhmx8zcDNz3fM8M2bJ7bZm7/BAIqQJzz7IgTzItybgKYBCKIZSKIdKqIZzUC+8jeCDy9BszbK3BW5DB9yD+/AQHsMgPBPOc3gF72HCmhXnE3yF7/ATfsMCJQEldZatmXdWrPHDLNMZr5iCSRj3qu4NvPCIERiCAc+SNX1u0QNd0OletKbNJVqhGZrA5/prTWO8qINaqIYz8cpSHidK4SQUxs1bUxAr8iEPsmPnrMmA5BjhQDzExPwRLkaOiE1RcWyGiMvRUnEHRfwRKNBuriI4pUCu08JdoczuKuGpUUeeOuFtAJ869zYJp1nn4rSKhLZV0SkSu6FnzZqkfni6LoZF8uiGGBMp72AiaE3qZ/gWEj9E2q+wmBPpi7ASUVtBjTIiQViDJVAL6RE/zMIMfIFJ+ABvYQxGYViEB6AferVRuBvuQDvcghtwFS7BRbgA50WoBs5ChTKHyqAETkAhHIPDkAvZIpgBqdZkhkQO5EJ+SPejICyKoBhKoTycrq8fEdVQC3XQENFSvk3RBNc2M61pgbao6IAueBDVpeuDJ1tiCEbg5VaW/thtMQ4fYWp7vzXTO2IW/LAAgR2lX98VYYgy3dkSuxFG6yrZCYjtBfBrqa1ZmNZG0SmYVJbouNh8DaPKHBmGQTUTfgS96jfcLUJ3oV3nErwJ11Os2bgCvmTRKNbrk0StWKvS+7JWKVbLoCRBFIuV4444KpYPecUBEciCND1LgSTeJu+evo7/xz8hB4uLCwGVSQAAAABJRU5ErkJggg==", "base64");
    const m = [0.85 * 512, 0.65 * 512];
    const c = createCanvas(512, 512);
    const context = c.getContext("2d");
    context.font = "italic 44pt '" + "M PLUS Rounded 1c" + "', sans-serif";
    context.textAlign = "center";
    context.fillStyle = "#000000";
    context.strokeStyle = "#000000";
    context.lineWidth = 3;
    context.strokeText("インターネット", 256 - 2, 0.59 * 512 + 6, m[0]);
    context.fillText("インターネット", 256 - 6, 0.59 * 512, m[0]);
    context.strokeText("やめろ", 256 - 2, 0.7 * 512 + 6, m[1]);
    context.fillText("やめろ", 256 - 6, 0.7 * 512, m[1]);
    context.save();
    context.globalCompositeOperation = "source-in";
    const img = await loadImage(faviconImage);
    context.drawImage(img, 0, 0, img.width, img.height, 0, 0.59 * 512 - 55, 512, 0.7 * 512 - 0.59 * 512 + 80);
    context.restore();
    const t = createCanvas(512, 512);
    const canvas = t.getContext("2d");
    canvas.font = "bold italic 44pt '" + "M PLUS Rounded 1c" + "'";
    canvas.textAlign = "center";
    canvas.fillStyle = "#ffffff";
    canvas.strokeStyle = "#ffffff";
    canvas.lineWidth = 3;
    canvas.strokeText("インターネット", 256 - 2, 0.59 * 512 + 6, m[0]);
    canvas.fillText("インターネット", 256 - 6, 0.59 * 512, m[0]);
    canvas.strokeText("やめろ", 256 - 2, 0.7 * 512 + 6, m[1]);
    canvas.fillText("やめろ", 256 - 6, 0.7 * 512, m[1]);
    StackBlur.canvasRGBA(t as unknown as HTMLCanvasElement, 0, 0.59 * 512 - 60, 512, 0.7 * 512 - 0.59 * 512 + 90, 6);
    ctx.drawImage(t, 0, 0, 512, 512, 0.025 * 512 + 0, -512 / 2 * 0.35 + 0, 0.95 * 512, 1.38 * 512);
    ctx.drawImage(t, 0, 0, 512, 512, 0.025 * 512 + 0, -512 / 2 * 0.35 + 0, 0.95 * 512, 1.38 * 512);
    ctx.drawImage(t, 0, 0, 512, 512, 0.025 * 512 + 0, -512 / 2 * 0.35 + 0, 0.95 * 512, 1.38 * 512);
    ctx.drawImage(c, 0, 0, 512, 512, 0.025 * 512 + 0, -512 / 2 * 0.35 + 0, 0.95 * 512, 1.38 * 512);
    (i as UserContextMenuCommandInteraction).followUp({ files: [dst.toBuffer()] })
  }
  
});

client.login(process.env.DISCORD_TOKEN);