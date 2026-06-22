loadJadwal();
loadDokterDropdown();

function loadJadwal() {

    fetch("/api/jadwal")
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(jadwal => {

                html += `
                <tr>

                    <td>${jadwal.id}</td>

                    <td>${jadwal.nama_dokter}</td>

                    <td>${jadwal.hari}</td>

                    <td>${jadwal.jam_mulai}</td>

                    <td>${jadwal.jam_selesai}</td>

                    <td>${jadwal.poli ?? '-'}</td>

                    <td>

                        <button
    class="btn btn-warning btn-sm"
    onclick="editJadwal(${jadwal.id})">

    Edit

</button>

<button
    class="btn btn-danger btn-sm"
    onclick="hapusJadwal(${jadwal.id})">

    Hapus

</button>

                    </td>

                </tr>
                `;

            });

            document.getElementById("jadwalTable")
                .innerHTML = html;

        });

}
function loadDokterDropdown() {

    fetch("/api/list-dokter")
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(dokter => {

                html += `
                    <option value="${dokter.id}">
                        ${dokter.nama_dokter}
                    </option>
                `;

            });

            document.getElementById("dokter_id")
                .innerHTML = html;

        });

}
function tambahJadwal() {

    const data = {

        dokter_id:
            document.getElementById("dokter_id").value,

        hari:
            document.getElementById("hari").value,

        jam_mulai:
            document.getElementById("jam_mulai").value,

        jam_selesai:
            document.getElementById("jam_selesai").value,

        poli:
            document.getElementById("poli").value

    };

    fetch("/api/jadwal", {

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
function loadDokterEditDropdown(selectedId = null) {

    fetch("/api/list-dokter")
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(dokter => {

                html += `
                    <option
                        value="${dokter.id}"
                        ${dokter.id == selectedId ? 'selected' : ''}>

                        ${dokter.nama_dokter}

                    </option>
                `;

            });

            document.getElementById("edit_dokter_id")
                .innerHTML = html;

        });

}
function editJadwal(id) {

    fetch(`/api/jadwal/${id}`)
        .then(res => res.json())
        .then(jadwal => {

            document.getElementById("edit_id").value =
                jadwal.id;

            document.getElementById("edit_hari").value =
                jadwal.hari;

            document.getElementById("edit_jam_mulai").value =
                jadwal.jam_mulai;

            document.getElementById("edit_jam_selesai").value =
                jadwal.jam_selesai;

            document.getElementById("edit_poli").value =
                jadwal.poli;

            loadDokterEditDropdown(
                jadwal.dokter_id
            );

            const modal =
                new bootstrap.Modal(
                    document.getElementById("editJadwalModal")
                );

            modal.show();

        });

}
function updateJadwal() {

    const id =
        document.getElementById("edit_id").value;

    const data = {

        dokter_id:
            document.getElementById("edit_dokter_id").value,

        hari:
            document.getElementById("edit_hari").value,

        jam_mulai:
            document.getElementById("edit_jam_mulai").value,

        jam_selesai:
            document.getElementById("edit_jam_selesai").value,

        poli:
            document.getElementById("edit_poli").value

    };

    fetch(`/api/jadwal/${id}`, {

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
function hapusJadwal(id) {

    Swal.fire({

        title: "Yakin?",

        text: "Jadwal akan dihapus",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Ya",

        cancelButtonText: "Batal"

    }).then((result) => {

        if(result.isConfirmed){

            fetch(`/api/jadwal/${id}`, {

                method: "DELETE"

            })
            .then(res => res.json())
            .then(data => {

                Swal.fire(
                    "Berhasil",
                    data.message,
                    "success"
                );

                loadJadwal();

            });

        }

    });

}