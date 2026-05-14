const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const port = 3335;

/*
====================================
KONEKSI DATABASE
====================================
*/
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chatbot_kesehatan",
});

db.connect((err) => {
  if (err) {
    console.log("Koneksi database gagal:", err);
  } else {
    console.log("Database berhasil terhubung");
  }
});

/*
====================================
KIRIM PESAN
====================================
*/
async function sendMessage(data) {
  try {
    const response = await fetch("http://127.0.0.1:2341/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.text();
    console.log("RESPONSE:", result);
  } catch (err) {
    console.log("ERROR:", err);
  }
}

/*
====================================
MENU UTAMA
====================================
*/
async function sendMainMenu(body) {
  await sendMessage({
    token: body.token,
    to: body.chat,
    message:
      "🏥 *Chatbot Konsultasi Layanan Kesehatan*\n\n" +
      "Selamat datang 👋\n\n" +
      "1️⃣ Cek Gejala Penyakit\n" +
      "2️⃣ Konsultasi dengan Dokter\n" +
      "3️⃣ Jadwal Dokter\n" +
      "4️⃣ Informasi Obat\n" +
      "5️⃣ Tips Kesehatan\n" +
      "6️⃣ Riwayat Konsultasi\n" +
      "7️⃣ Lokasi Klinik / RS\n" +
      "8️⃣ Hubungi Admin\n" +
      "9️⃣ Bantuan\n\n" +
      "Balas dengan angka menu.\n" +
      "Contoh: 1",
  });
}

/*
====================================
WEBHOOK
====================================
*/
app.post("/webhook", async (req, res) => {
  const body = req.body;
  const text = (body.msg?.rawText || "").trim().toLowerCase();

  /*
  ====================================
  TEST PING
  ====================================
  */
  if (text === "ping") {
    await sendMessage({
      token: body.token,
      to: body.chat,
      message: "pong",
    });

    return res.end();
  }

  /*
  ====================================
  MENU 1 - FAQ / GEJALA
  ====================================
  */
  if (text === "1") {

    const sql = `SELECT * FROM faq`;

    db.query(sql, async (err, results) => {

      if (err) {
        console.log(err);

        await sendMessage({
          token: body.token,
          to: body.chat,
          message: "Gagal mengambil data gejala",
        });

        return res.end();
      }

      let pesan = "🔍 *Informasi Gejala Penyakit*\n\n";

      results.forEach((item, index) => {
        pesan += `${index + 1}. ${item.pertanyaan}\n`;
        pesan += `💡 ${item.jawaban}\n\n`;
      });

      await sendMessage({
        token: body.token,
        to: body.chat,
        message: pesan,
      });

      return res.end();
    });

    return;
  }

  /*
  ====================================
  MENU 2 - KONSULTASI
  ====================================
  */
  if (text === "2") {

    const sql = `
      INSERT INTO konsultasi 
      (user_id, keluhan)
      VALUES (?, ?)
    `;

    db.query(sql, [body.chat, "User meminta konsultasi"], async (err, result) => {

      if (err) {
        console.log(err);

        await sendMessage({
          token: body.token,
          to: body.chat,
          message: "Gagal menyimpan konsultasi",
        });

        return res.end();
      }

      await sendMessage({
        token: body.token,
        to: body.chat,
        message:
          "👨‍⚕️ *Konsultasi Dokter*\n\n" +
          "Konsultasi berhasil dibuat.\n" +
          "Silakan tunggu dokter merespon.",
      });

      return res.end();
    });

    return;
  }

  /*
  ====================================
  MENU 3 - JADWAL DOKTER
  ====================================
  */
  if (text === "3") {

    const sql = `
      SELECT 
        dokter.nama_dokter,
        dokter.spesialis,
        jadwal_dokter.hari,
        jadwal_dokter.jam_mulai,
        jadwal_dokter.jam_selesai,
        jadwal_dokter.poli
      FROM jadwal_dokter
      JOIN dokter
      ON jadwal_dokter.dokter_id = dokter.id
    `;

    db.query(sql, async (err, results) => {

      if (err) {
        console.log(err);

        await sendMessage({
          token: body.token,
          to: body.chat,
          message: "Gagal mengambil jadwal dokter",
        });

        return res.end();
      }

      let pesan = "📅 *Jadwal Dokter*\n\n";

      results.forEach((item, index) => {
        pesan += `${index + 1}. ${item.nama_dokter}\n`;
        pesan += `${item.spesialis}\n`;
        pesan += `${item.hari}\n`;
        pesan += `${item.jam_mulai} - ${item.jam_selesai}\n`;
        pesan += `Poli: ${item.poli}\n\n`;
      });

      await sendMessage({
        token: body.token,
        to: body.chat,
        message: pesan,
      });

      return res.end();
    });

    return;
  }

  /*
  ====================================
  MENU 4 - INFORMASI OBAT
  ====================================
  */
  if (text === "4") {

    const sql = `SELECT * FROM obat`;

    db.query(sql, async (err, results) => {

      if (err) {
        console.log(err);

        await sendMessage({
          token: body.token,
          to: body.chat,
          message: "Gagal mengambil data obat",
        });

        return res.end();
      }

      let pesan = "💊 *Informasi Obat*\n\n";

      results.forEach((item, index) => {
        pesan += `${index + 1}. ${item.nama_obat}\n`;
        pesan += `Fungsi: ${item.kegunaan}\n\n`;
      });

      await sendMessage({
        token: body.token,
        to: body.chat,
        message: pesan,
      });

      return res.end();
    });

    return;
  }

  /*
  ====================================
  MENU 5 - TIPS KESEHATAN
  ====================================
  */
  if (text === "5") {

    const sql = `SELECT * FROM faq LIMIT 5`;

    db.query(sql, async (err, results) => {

      if (err) {
        console.log(err);

        await sendMessage({
          token: body.token,
          to: body.chat,
          message: "Gagal mengambil tips kesehatan",
        });

        return res.end();
      }

      let pesan = "🌿 *Tips Kesehatan*\n\n";

      results.forEach((item, index) => {
        pesan += `• ${item.jawaban}\n`;
      });

      await sendMessage({
        token: body.token,
        to: body.chat,
        message: pesan,
      });

      return res.end();
    });

    return;
  }

  /*
  ====================================
  MENU 6 - RIWAYAT KONSULTASI
  ====================================
  */
  if (text === "6") {

    const sql = `
      SELECT * FROM konsultasi
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT 5
    `;

    db.query(sql, [body.chat], async (err, results) => {

      if (err) {
        console.log(err);

        await sendMessage({
          token: body.token,
          to: body.chat,
          message: "Gagal mengambil riwayat konsultasi",
        });

        return res.end();
      }

      if (results.length === 0) {
        await sendMessage({
          token: body.token,
          to: body.chat,
          message: "Belum ada riwayat konsultasi",
        });

        return res.end();
      }

      let pesan = "📄 *Riwayat Konsultasi*\n\n";

      results.forEach((item, index) => {
        pesan += `${index + 1}. ${item.keluhan}\n`;

        if (item.hasil_diagnosa) {
          pesan += `Diagnosa: ${item.hasil_diagnosa}\n`;
        }

        pesan += `\n`;
      });

      await sendMessage({
        token: body.token,
        to: body.chat,
        message: pesan,
      });

      return res.end();
    });

    return;
  }

  /*
  ====================================
  MENU 7 - LOKASI RS
  ====================================
  */
  if (text === "7") {

    await sendMessage({
      token: body.token,
      to: body.chat,
      message:
        "📍 *Lokasi Klinik / Rumah Sakit*\n\n" +
        "RSUD Daha Husada\n" +
        "Jl. Ahmad Yani No.123",
    });

    return res.end();
  }

  /*
  ====================================
  MENU 8 - ADMIN
  ====================================
  */
  if (text === "8") {

    const sql = `SELECT * FROM admin LIMIT 1`;

    db.query(sql, async (err, results) => {

      if (err) {
        console.log(err);

        await sendMessage({
          token: body.token,
          to: body.chat,
          message: "Gagal mengambil data admin",
        });

        return res.end();
      }

      if (results.length === 0) {
        await sendMessage({
          token: body.token,
          to: body.chat,
          message: "Data admin tidak tersedia",
        });

        return res.end();
      }

      const admin = results[0];

      let pesan =
        "📞 *Hubungi Admin*\n\n" +
        `Nama: ${admin.nama}\n` +
        `No HP: ${admin.no_hp}`;

      await sendMessage({
        token: body.token,
        to: body.chat,
        message: pesan,
      });

      return res.end();
    });

    return;
  }

  /*
  ====================================
  MENU 9 - BANTUAN
  ====================================
  */
  if (text === "9") {

    await sendMessage({
      token: body.token,
      to: body.chat,
      message:
        "❓ *Bantuan*\n\n" +
        "Kirim angka menu untuk menggunakan chatbot.\n\n" +
        "Contoh:\n1\n2\n3",
    });

    return res.end();
  }

  /*
  ====================================
  MENU UTAMA
  ====================================
  */
  await sendMainMenu(body);

  return res.end();
});

/*
====================================
JALANKAN SERVER
====================================
*/
app.listen(port, () => {
  console.log("Server running on PORT", port);
});