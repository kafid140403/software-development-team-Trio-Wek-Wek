const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const qrcode = require("qrcode-terminal");
const db = require("./db");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📱 Scan QR WhatsApp:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startBot();
    }

    if (connection === "open") {
      console.log("✅ WhatsApp Bot Terhubung!");
    }
  });

  // ================= TERIMA PESAN =================
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    const pesan = text.toLowerCase().trim();
    let reply = "";

    // ================= LOGIC =================
    if (["hai", "halo", "hi"].includes(pesan)) {
      reply = `🏥 *LAYANAN KONSULTASI KESEHATAN*

Selamat datang di layanan informasi Layanan Kesehatan.

1. Konsultasi Kesehatan
2. Informasi Kesehatan
3. Riwayat Chat
4. Bantuan
5. Saran dan Rekomendasi

Ketik: *info#nomor*
Contoh: info#1`;
    }

   