import express from "express";
import cors from "cors";
import { Client, GatewayIntentBits } from "discord.js";


const app = express();
app.use(cors());

/* ===============================
   BOT KONFIGŪRACIJA
================================ */
const botConfigs = [
  {
    id: "crazy",
    token: process.env.BOT_TOKEN_CRAZY
  },
  {
    id: "latitane",
    token: process.env.BOT_TOKEN_LATITANE
  },
  {
    id: "signup",
    token: process.env.BOT_TOKEN_SIGNUP
  },
  {
    id: "ticket",
    token: process.env.BOT_TOKEN_TICKET
  },
  {
    id: "crafting",
    token: process.env.BOT_TOKEN_CRAFTING
  }
];

/* ===============================
   BOT CLIENTAI
================================ */
const bots = {};

for (const cfg of botConfigs) {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds]
  });

  client.login(cfg.token);

  client.once("ready", () => {
    console.log(`✅ ${cfg.id} logged in as ${client.user.tag}`);
  });

  bots[cfg.id] = client;
}

/* ===============================
   API ENDPOINT
================================ */
app.get("/status", (req, res) => {
  const result = [];

  for (const id in bots) {
    const client = bots[id];

    if (!client.user) continue;

    result.push({
      id,
      online: client.ws.status === 0,
      name: client.user.username,
      avatar: client.user.displayAvatarURL({ size: 256 }),
      guilds: client.guilds.cache.size
    });
  }

  res.json({ bots: result });
});

/* ===============================
   SERVER
================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});

