npm init -y


import { Client, GatewayIntentBits } from "discord.js";
import OpenAI from "openai";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const openai = new OpenAI({
  apiKey: "SUA_API_KEY_AQUI",
});

const systemPrompt = `
Você é um bot chamado Charles.
Você usa gírias, fala seco e é meio ignorante.
Você zoa as pessoas, mas quando o assunto é sério você fica direto e objetivo.
Responde curto, sem textão.
`;

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // só responde se mencionar o bot
  if (!message.mentions.has(client.user)) return;

  const msg = message.content
    .replace(`<@${client.user.id}>`, "")
    .trim();

  if (!msg) return;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: msg }
      ],
    });

    const reply = response.choices[0].message.content;

    message.reply(reply);

  } catch (err) {
    console.error(err);
    message.reply("deu ruim aqui, tenta dnv");
  }
});

client.login("SEU_TOKEN_DISCORD");
