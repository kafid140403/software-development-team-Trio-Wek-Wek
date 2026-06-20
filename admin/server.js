const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chatbot_kesehatan"
});

db.connect((err) => {
    if(err){
        console.log(err);
    }else{
        console.log("Database Connected");
    }
});

app.get("/", (req,res)=>{
    res.send("Admin API Running");
});

app.listen(4000, ()=>{
    console.log("Server Admin Running On Port 4000");
});
app.get("/users", (req,res)=>{

    db.query(
        "SELECT * FROM users",
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );

});
// GET ALL USERS
app.get("/api/users", (req, res) => {

    db.query(
        "SELECT * FROM users",
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );

});
// GET USER BY ID
app.get("/api/users/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM users WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result[0]);
        }
    );

});


// UPDATE USER
app.put("/api/users/:id", (req, res) => {

    const id = req.params.id;

    const {
        nama,
        no_whatsapp,
        alamat,
        tanggal_lahir,
        jenis_kelamin
    } = req.body;

    db.query(
        `
        UPDATE users
        SET
            nama=?,
            no_whatsapp=?,
            alamat=?,
            tanggal_lahir=?,
            jenis_kelamin=?
        WHERE id=?
        `,
        [
            nama,
            no_whatsapp,
            alamat,
            tanggal_lahir,
            jenis_kelamin,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Data user berhasil diupdate"
            });

        }
    );

});
// DELETE USER
app.delete("/api/users/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM users WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "User berhasil dihapus"
            });

        }
    );

});
app.get("/api/dokter", (req, res) => {

    db.query(
        "SELECT * FROM dokter",
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});
app.post("/api/dokter", (req, res) => {

    const {
        nama_dokter,
        spesialis,
        no_hp,
        status_aktif
    } = req.body;

    db.query(
        `
        INSERT INTO dokter
        (
            nama_dokter,
            spesialis,
            no_hp,
            status_aktif
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            nama_dokter,
            spesialis,
            no_hp,
            status_aktif
        ],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Dokter berhasil ditambahkan"
            });

        }
    );

});
app.get("/api/dokter/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM dokter WHERE id = ?",
        [id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result[0]);

        }
    );

});
app.put("/api/dokter/:id", (req, res) => {

    const id = req.params.id;

    const {
        nama_dokter,
        spesialis,
        no_hp,
        status_aktif
    } = req.body;

    db.query(
        `
        UPDATE dokter
        SET
            nama_dokter=?,
            spesialis=?,
            no_hp=?,
            status_aktif=?
        WHERE id=?
        `,
        [
            nama_dokter,
            spesialis,
            no_hp,
            status_aktif,
            id
        ],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Data dokter berhasil diupdate"
            });

        }
    );

});
app.delete("/api/dokter/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM dokter WHERE id=?",
        [id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Dokter berhasil dihapus"
            });

        }
    );

});
app.get("/api/jadwal", (req, res) => {

    db.query(
        `
        SELECT
            jd.*,
            d.nama_dokter

        FROM jadwal_dokter jd

        JOIN dokter d
            ON jd.dokter_id = d.id
        `,
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});
app.get("/api/list-dokter", (req, res) => {

    db.query(
        "SELECT id, nama_dokter FROM dokter WHERE status_aktif='Aktif'",
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});
app.post("/api/jadwal", (req, res) => {

    const {
        dokter_id,
        hari,
        jam_mulai,
        jam_selesai,
        poli
    } = req.body;

    db.query(
        `
        INSERT INTO jadwal_dokter
        (
            dokter_id,
            hari,
            jam_mulai,
            jam_selesai,
            poli
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            dokter_id,
            hari,
            jam_mulai,
            jam_selesai,
            poli
        ],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Jadwal berhasil ditambahkan"
            });

        }
    );

});
app.get("/api/jadwal/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM jadwal_dokter WHERE id = ?",
        [id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result[0]);

        }
    );

});
app.put("/api/jadwal/:id", (req, res) => {

    const id = req.params.id;

    const {
        dokter_id,
        hari,
        jam_mulai,
        jam_selesai,
        poli
    } = req.body;

    db.query(
        `
        UPDATE jadwal_dokter
        SET
            dokter_id=?,
            hari=?,
            jam_mulai=?,
            jam_selesai=?,
            poli=?
        WHERE id=?
        `,
        [
            dokter_id,
            hari,
            jam_mulai,
            jam_selesai,
            poli,
            id
        ],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Jadwal berhasil diupdate"
            });

        }
    );

});
app.delete("/api/jadwal/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM jadwal_dokter WHERE id=?",
        [id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Jadwal berhasil dihapus"
            });

        }
    );

});
app.get("/api/obat", (req, res) => {

    db.query(
        "SELECT * FROM obat",
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});
app.post("/api/obat", (req, res) => {

    const {
        nama_obat,
        fungsi,
        aturan_pakai,
        keterangan
    } = req.body;

    db.query(
        `
        INSERT INTO obat
        (
            nama_obat,
            fungsi,
            aturan_pakai,
            keterangan
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            nama_obat,
            fungsi,
            aturan_pakai,
            keterangan
        ],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Obat berhasil ditambahkan"
            });

        }
    );

});
app.get("/api/obat/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM obat WHERE id=?",
        [id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result[0]);

        }
    );

});
app.put("/api/obat/:id", (req, res) => {

    const id = req.params.id;

    const {
        nama_obat,
        fungsi,
        aturan_pakai,
        keterangan
    } = req.body;

    db.query(
        `
        UPDATE obat
        SET
            nama_obat=?,
            fungsi=?,
            aturan_pakai=?,
            keterangan=?
        WHERE id=?
        `,
        [
            nama_obat,
            fungsi,
            aturan_pakai,
            keterangan,
            id
        ],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Obat berhasil diupdate"
            });

        }
    );

});
app.delete("/api/obat/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM obat WHERE id=?",
        [id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Obat berhasil dihapus"
            });

        }
    );

});
app.get("/api/konsultasi", (req, res) => {

    db.query(
        `
        SELECT
            k.*,
            u.nama

        FROM konsultasi k

        JOIN users u
            ON k.user_id = u.id

        ORDER BY k.id DESC
        `,
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});
app.get("/api/konsultasi/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        `
        SELECT
            k.*,
            u.nama

        FROM konsultasi k

        LEFT JOIN users u
            ON k.user_id = u.id

        WHERE k.id = ?
        `,
        [id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result[0]);

        }
    );

});
app.put("/api/konsultasi/status/:id", (req, res) => {

    const id = req.params.id;

    const { status } = req.body;

    db.query(
        `
        UPDATE konsultasi
        SET status=?
        WHERE id=?
        `,
        [status, id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message: "Status berhasil diupdate"
            });

        }
    );

});
app.delete("/api/konsultasi/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM konsultasi WHERE id=?",
        [id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"Konsultasi berhasil dihapus"
            });

        }
    );

});
app.get("/api/dashboard", async (req, res) => {

    try {

        db.query(
            `
            SELECT
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM dokter) as total_dokter,
                (SELECT COUNT(*) FROM obat) as total_obat,
                (SELECT COUNT(*) FROM konsultasi) as total_konsultasi
            `,
            (err, result) => {

                if(err){
                    return res.status(500).json(err);
                }

                res.json(result[0]);

            }
        );

    } catch(error){

        res.status(500).json(error);

    }

});