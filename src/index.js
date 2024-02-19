const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
  // proxyAuthentication: { username: 'username', password: 'password' },
  puppeteer: {
    // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
    headless: false,
  },
});

client.initialize();

client.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  //   console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessful
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
});

const app = express();

const PORT = 3000;

app.get("/api", (req, res) => {
  let tujuan = req.query.tujuan;
  let pesan = req.query.pesan;
  tujuan = tujuan.substring(1);
  tujuan = `62${tujuan}@c.us`;

  client.sendMessage(tujuan, pesan);

  console.log(tujuan);
  console.log(pesan);
  res.json({ status: false });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
