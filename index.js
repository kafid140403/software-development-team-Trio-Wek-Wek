const express = require("express");
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const port = 3335;

/*
====================================
KIRIM PESAN TEXT
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
      "Selamat datang 👋\n" +
      "Silakan pilih layanan berikut:\n\n" +
      "1️⃣ Cek Gejala Penyakit\n" +
      "2️⃣ Konsultasi dengan Dokter\n" +
      "3️⃣ Jadwal Dokter\n" +
      "4️⃣ Informasi Obat Dasar\n" +
      "5️⃣ Tips Kesehatan Harian\n" +
      "6️⃣ Riwayat Konsultasi\n" +
      "7️⃣ Lokasi Klinik / Rumah Sakit\n" +
      "8️⃣ Hubungi Admin\n" +
      "9️⃣ Bantuan\n\n" +
      "Silakan balas dengan angka pilihan Anda.\n" +
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
  MENU 1 - CEK GEJALA
  ====================================
  */
  if (text === "1") {
    await sendMessage({
      token: body.token,
      to: body.chat,
      message:
        "🔍 *Cek Gejala Penyakit*\n\n" +
        "Silakan pilih keluhan yang Anda rasakan:\n\n" +
        "• Demam\n" +
        "• Batuk & Flu\n" +
        "• Sakit Kepala\n" +
        "• Nyeri Lambung\n" +
        "• Sesak Napas\n\n" +
        "Silakan jelaskan gejala Anda.",
    });

    return res.end();
  }

  /*
  ====================================
  MENU 2 - KONSULTASI DOKTER
  ====================================
  */
  if (text === "2") {
    await sendMessage({
      token: body.token,
      to: body.chat,
      message:
        "👨‍⚕️ *Konsultasi dengan Dokter*\n\n" +
        "Silakan kirim keluhan Anda secara singkat.\n" +
        "Dokter akan segera merespon.",
    });

    return res.end();
  }

  /*
  ====================================
  MENU 3 - JADWAL DOKTER
  ====================================
  */
  if (text === "3") {
    await sendMessage({
      token: body.token,
      to: body.chat,
      message:
        "📅 *Jadwal Dokter*\n\n" +
        "1. Dokter Umum : Senin - Jumat (08:00 - 15:00)\n" +
        "2. Dokter Anak : Senin - Kamis (09:00 - 14:00)\n" +
        "3. Dokter Gigi : Selasa - Sabtu (10:00 - 16:00)",
    });

    return res.end();
  }

  /*
  ====================================
  MENU 4 - INFORMASI OBAT
  ====================================
  */
  if (text === "4") {
    await sendMessage({
      token: body.token,
      to: body.chat,
      message:
        "💊 *Informasi Obat Dasar*\n\n" +
        "1. Paracetamol → untuk demam\n" +
        "2. OBH → untuk batuk\n" +
        "3. Antasida → untuk maag\n" +
        "4. Vitamin C → menjaga daya tahan tubuh",
    });

    return res.end();
  }

  /*
  ====================================
  MENU 5 - TIPS KESEHATAN
  ====================================
  */
  if (text === "5") {
    await sendMessage({
      token: body.token,
      to: body.chat,
      message:
        "🌿 *Tips Kesehatan Harian*\n\n" +
        "• Minum air putih 8 gelas per hari\n" +
        "• Tidur cukup 7-8 jam\n" +
        "• Olahraga rutin\n" +
        "• Konsumsi makanan bergizi",
    });

    return res.end();
  }

  /*
  ====================================
  MENU 6 - RIWAYAT KONSULTASI
  ====================================
  */
  if (text === "6") {
    await sendMessage({
      token: body.token,
      to: body.chat,
      message:
        "📄 *Riwayat Konsultasi*\n\n" +
        "Belum ada riwayat konsultasi sebelumnya.",
    });

    return res.end();
  }

  /*
  ====================================
  MENU 7 - LOKASI KLINIK / RS
  ====================================
  */
  if (text === "7") {
    await sendMessage({
      token: body.token,
      to: body.chat,
      message:
        "📍 *Lokasi Klinik / Rumah Sakit*\n\n" +
        "RSUD Daha Husada\n" +
        "Jl. Contoh No.123, Kota Anda",
    });

    return res.end();
  }

  /*
  ====================================
  MENU 8 - HUBUNGI ADMIN
  ====================================
  */
  if (text === "8") {
    await sendMessage({
      token: body.token,
      to: body.chat,
      message:
        "📞 *Hubungi Admin*\n\n" +
        "Admin Rumah Sakit:\n" +
        "0812-3456-7890",
    });

    return res.end();
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
        "❓ *Bantuan Penggunaan Bot*\n\n" +
        "Cukup kirim pesan apa saja untuk membuka menu utama.\n\n" +
        "Lalu balas dengan angka pilihan menu.\n" +
        "Contoh: 1",
    });

    return res.end();
  }

  /*
  ====================================
  INPUT APA SAJA → MENU UTAMA
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