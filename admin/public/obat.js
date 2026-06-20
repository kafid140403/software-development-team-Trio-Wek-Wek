loadObat();

function loadObat() {

    fetch("/api/obat")
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(obat => {

                html += `
                <tr>

                    <td>${obat.id}</td>

                    <td>${obat.nama_obat}</td>

                    <td>${obat.fungsi ?? "-"}</td>

                    <td>${obat.aturan_pakai ?? "-"}</td>

                    <td>${obat.keterangan ?? "-"}</td>

                    <td>

                        <button
    class="btn btn-warning btn-sm"
    onclick="editObat(${obat.id})">

    Edit

</button>

<button
    class="btn btn-danger btn-sm"
    onclick="hapusObat(${obat.id}, '${obat.nama_obat}')">

    Hapus

</button>

                    </td>

                </tr>
                `;

            });

            document.getElementById("obatTable")
                .innerHTML = html;

        });

}
function tambahObat() {

    const data = {

        nama_obat:
            document.getElementById("nama_obat").value,

        fungsi:
            document.getElementById("fungsi").value,

        aturan_pakai:
            document.getElementById("aturan_pakai").value,

        keterangan:
            document.getElementById("keterangan").value

    };

    fetch("/api/obat", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    })
    .then(res => res.json())
    .then(data => {

        alert(data.message);

        location.reload();

    });

}
function editObat(id) {

    fetch(`/api/obat/${id}`)
        .then(res => res.json())
        .then(obat => {

            document.getElementById("edit_id").value =
                obat.id;

            document.getElementById("edit_nama_obat").value =
                obat.nama_obat;

            document.getElementById("edit_fungsi").value =
                obat.fungsi;

            document.getElementById("edit_aturan_pakai").value =
                obat.aturan_pakai;

            document.getElementById("edit_keterangan").value =
                obat.keterangan;

            const modal =
                new bootstrap.Modal(
                    document.getElementById("editObatModal")
                );

            modal.show();

        });

}
function updateObat() {

    const id =
        document.getElementById("edit_id").value;

    const data = {

        nama_obat:
            document.getElementById("edit_nama_obat").value,

        fungsi:
            document.getElementById("edit_fungsi").value,

        aturan_pakai:
            document.getElementById("edit_aturan_pakai").value,

        keterangan:
            document.getElementById("edit_keterangan").value

    };

    fetch(`/api/obat/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    })
    .then(res => res.json())
    .then(data => {

        alert(data.message);

        location.reload();

    });

}
function hapusObat(id, nama) {

    Swal.fire({

        title: "Yakin?",

        text: `Hapus ${nama}?`,

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Ya",

        cancelButtonText: "Batal"

    }).then((result) => {

        if(result.isConfirmed){

            fetch(`/api/obat/${id}`, {

                method: "DELETE"

            })
            .then(res => res.json())
            .then(data => {

                Swal.fire(
                    "Berhasil",
                    data.message,
                    "success"
                );

                loadObat();

            });

        }

    });

}