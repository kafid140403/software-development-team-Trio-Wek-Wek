const express = require("express");
<<<<<<< HEAD
const mysql = require("mysql2");

=======
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const port = 3335;

/*
====================================
<<<<<<< HEAD
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
=======
KIRIM PESAN TEXT
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868
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

<<<<<<< HEAD
  const nomorWa = body.sender?.pn
    ? body.sender.pn.split("@")[0]
    : null;
    let currentUser = null;

if (nomorWa) {

  db.query(
    "SELECT * FROM users WHERE no_whatsapp = ?",
    [nomorWa],
    async (err, users) => {

      if (err) {
        console.log(err);
        return;
      }

      if (users.length > 0) {
        currentUser = users[0];
      }
    }
  );
}

  const namaUser =
    body.sender?.pushName && body.sender.pushName !== "."
      ? body.sender.pushName
      : "User WhatsApp";

  // AUTO REGISTER USER
  if (nomorWa) {
    db.query(
      "SELECT id FROM users WHERE no_whatsapp = ?",
      [nomorWa],
      (err, users) => {

        if (err) {
          console.log(err);
          return;
        }

        if (users.length === 0) {

        db.query(
  `INSERT INTO users
   (nama, no_whatsapp, alamat, tanggal_lahir, jenis_kelamin)
   VALUES (?, ?, ?, ?, ?)`,
  [
    "",
    nomorWa,
    "",
    null,
    null
  ],
            (err) => {

              if (err) {
                console.log("Gagal auto register user:", err);
              } else {
                console.log("User baru berhasil dibuat:", nomorWa);
              }

            }
          );

        }

      }
    );
  }

=======
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868
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

<<<<<<< HEAD
/*
====================================
REGISTRASI IDENTITAS
====================================
*/

if (
  text.startsWith("nama:") &&
  text.includes("tanggal lahir:") &&
  text.includes("jenis kelamin:") &&
  text.includes("alamat:")
) {

  const nama =
    text.match(/nama:\s*(.*)/i)?.[1]
      ?.split("tanggal lahir:")[0]
      ?.trim();

  const tanggalLahir =
    text.match(/tanggal lahir:\s*(.*)/i)?.[1]
      ?.split("jenis kelamin:")[0]
      ?.trim();

  const jenisKelamin =
    text.match(/jenis kelamin:\s*(.*)/i)?.[1]
      ?.split("alamat:")[0]
      ?.trim();

  const alamat =
    text.match(/alamat:\s*(.*)/i)?.[1]
      ?.trim();

  db.query(
    `UPDATE users
     SET nama=?,
         tanggal_lahir=?,
         jenis_kelamin=?,
         alamat=?
     WHERE no_whatsapp=?`,
    [
      nama,
      tanggalLahir,
      jenisKelamin,
      alamat,
      nomorWa
    ],
    async (err) => {

      if (err) {
        console.log(err);

        await sendMessage({
          token: body.token,
          to: body.chat,
          message: "Gagal menyimpan data diri",
        });

        return res.end();
      }

      await sendMessage({
        token: body.token,
        to: body.chat,
        message:
          "✅ Data berhasil disimpan.\n\n" +
          "Silakan pilih menu:\n\n" +
          "1️⃣ Cek Gejala Penyakit\n" +
          "2️⃣ Konsultasi Dokter\n" +
          "3️⃣ Jadwal Dokter\n" +
          "4️⃣ Informasi Obat\n" +
          "5️⃣ Tips Kesehatan\n" +
          "6️⃣ Riwayat Konsultasi",
      });

      return res.end();
    }
  );

  return;
}
db.query(
  "SELECT * FROM users WHERE no_whatsapp=?",
  [nomorWa],
  async (err, users) => {

    if (users.length > 0) {

      const user = users[0];

      if (user.state === "menunggu_keluhan") {

        db.query(
          `INSERT INTO konsultasi
          (user_id, keluhan, status)
          VALUES (?, ?, ?)`,
          [
            user.id,
            body.msg.rawText,
            "Proses"
          ],
          async (err) => {

            if (err) {
              console.log(err);
              return res.end();
            }

            db.query(
              "UPDATE users SET state=NULL WHERE id=?",
              [user.id]
            );

            await sendMessage({
              token: body.token,
              to: body.chat,
              message:
                "✅ Keluhan berhasil dikirim.\n\n" +
                "Dokter akan segera meninjau konsultasi Anda."
            });

            return res.end();
          }
        );

        return;
      }

    }

  }
);
  /*
  ====================================
  MENU 1 - FAQ / GEJALA
  ====================================
  */
 db.query(
  "SELECT * FROM users WHERE no_whatsapp = ?",
  [nomorWa],
  async (err, users) => {

    if (err) {
      console.log(err);
      return;
    }

    if (
      users.length > 0 &&
      (
        !users[0].nama ||
        users[0].nama === ""
      )
    ) {

      await sendMessage({
        token: body.token,
        to: body.chat,
        message:
          "📝 Data diri Anda belum lengkap.\n\n" +
          "Silakan kirim:\n\n" +
          "Nama:\n" +
          "Tanggal Lahir:\n" +
          "Jenis Kelamin:\n" +
          "Alamat:\n\n" +
          "Contoh:\n\n" +
          "Nama: Mochamad kafid syaifudin\n" +
          "Tanggal Lahir: 2000-01-15\n" +
          "Jenis Kelamin: Laki-laki\n" +
          "Alamat: Malang"
      });

      return res.end();
    }

  }
);
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
=======
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
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868
  }

  /*
  ====================================
<<<<<<< HEAD
  MENU 2 - KONSULTASI
  ====================================
  */

  if (text === "2") {

  db.query(
    "UPDATE users SET state='menunggu_keluhan' WHERE no_whatsapp=?",
    [nomorWa]
  );

  await sendMessage({
    token: body.token,
    to: body.chat,
    message:
      "👨‍⚕️ *Konsultasi Dokter*\n\n" +
      "Silakan tuliskan keluhan yang Anda alami.\n\n" +
      "Contoh:\n" +
      "Saya mengalami demam sejak 3 hari dan sakit tenggorokan."
  });

  return res.end();
}
=======
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
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868

  /*
  ====================================
  MENU 3 - JADWAL DOKTER
  ====================================
  */
  if (text === "3") {
<<<<<<< HEAD

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
=======
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
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868
  }

  /*
  ====================================
  MENU 4 - INFORMASI OBAT
  ====================================
  */
  if (text === "4") {
<<<<<<< HEAD

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
=======
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
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868
  }

  /*
  ====================================
  MENU 5 - TIPS KESEHATAN
  ====================================
  */
  if (text === "5") {
<<<<<<< HEAD

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

  db.query(
    "SELECT id FROM users WHERE no_whatsapp = ?",
    [nomorWa],
    async (err, users) => {

      if (err) {
        console.log(err);
        return res.end();
      }

      if (users.length === 0) {

        await sendMessage({
          token: body.token,
          to: body.chat,
          message: "Data pengguna tidak ditemukan",
        });

        return res.end();
      }

      const userId = users[0].id;

      const sql = `
        SELECT *
        FROM konsultasi
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT 5
      `;

      db.query(sql, [userId], async (err, results) => {

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
          pesan += `Status: ${item.status}\n`;

          if (item.hasil_diagnosa) {
            pesan += `Diagnosa: ${item.hasil_diagnosa}\n`;
          }

          pesan += "\n";
        });

        await sendMessage({
          token: body.token,
          to: body.chat,
          message: pesan,
        });

        return res.end();
      });
    }
  );

  return;
}

  /*
  ====================================
  MENU 7 - LOKASI RS
  ====================================
  */
  if (text === "7") {

=======
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868
    await sendMessage({
      token: body.token,
      to: body.chat,
      message:
<<<<<<< HEAD
        "📍 *Lokasi Klinik / Rumah Sakit*\n\n" +
        "RSUD Daha Husada\n" +
        "Jl. Ahmad Yani No.123",
=======
        "🌿 *Tips Kesehatan Harian*\n\n" +
        "• Minum air putih 8 gelas per hari\n" +
        "• Tidur cukup 7-8 jam\n" +
        "• Olahraga rutin\n" +
        "• Konsumsi makanan bergizi",
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868
    });

    return res.end();
  }

  /*
  ====================================
<<<<<<< HEAD
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
=======
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
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868
  }

  /*
  ====================================
  MENU 9 - BANTUAN
  ====================================
  */
  if (text === "9") {
<<<<<<< HEAD

=======
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868
    await sendMessage({
      token: body.token,
      to: body.chat,
      message:
<<<<<<< HEAD
        "❓ *Bantuan*\n\n" +
        "Kirim angka menu untuk menggunakan chatbot.\n\n" +
        "Contoh:\n1\n2\n3",
=======
        "❓ *Bantuan Penggunaan Bot*\n\n" +
        "Cukup kirim pesan apa saja untuk membuka menu utama.\n\n" +
        "Lalu balas dengan angka pilihan menu.\n" +
        "Contoh: 1",
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868
    });

    return res.end();
  }

  /*
  ====================================
<<<<<<< HEAD
  MENU UTAMA
=======
  INPUT APA SAJA → MENU UTAMA
>>>>>>> 8aa78e65cd784b1d5c84e5035da0bf9d519c2868
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