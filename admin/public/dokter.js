loadDokter();

function loadDokter() {

    fetch("/api/dokter")
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(dokter => {

                html += `
                <tr>

                    <td>${dokter.id}</td>

                    <td>${dokter.nama_dokter}</td>

                    <td>${dokter.spesialis ?? "-"}</td>

                    <td>${dokter.no_hp ?? "-"}</td>

                    <td>${dokter.status_aktif}</td>

                    <td>

                        <button
    class="btn btn-warning btn-sm"
    onclick="editDokter(${dokter.id})">

    Edit

</button>

                        <button
    class="btn btn-danger btn-sm"
    onclick="hapusDokter(${dokter.id}, '${dokter.nama_dokter}')">

    Hapus

</button>

                    </td>

                </tr>
                `;

            });

            document.getElementById("dokterTable")
                .innerHTML = html;

        });

}
function tambahDokter() {

    const data = {

        nama_dokter:
            document.getElementById("nama_dokter").value,

        spesialis:
            document.getElementById("spesialis").value,

        no_hp:
            document.getElementById("no_hp").value,

        status_aktif:
            document.getElementById("status_aktif").value

    };

    fetch("/api/dokter", {

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
function editDokter(id) {

    fetch(`/api/dokter/${id}`)
        .then(res => res.json())
        .then(dokter => {

            document.getElementById("edit_id").value =
                dokter.id;

            document.getElementById("edit_nama_dokter").value =
                dokter.nama_dokter;

            document.getElementById("edit_spesialis").value =
                dokter.spesialis;

            document.getElementById("edit_no_hp").value =
                dokter.no_hp;

            document.getElementById("edit_status_aktif").value =
                dokter.status_aktif;

            const modal =
                new bootstrap.Modal(
                    document.getElementById("editDokterModal")
                );

            modal.show();

        });

}
function updateDokter() {

    const id =
        document.getElementById("edit_id").value;

    const data = {

        nama_dokter:
            document.getElementById("edit_nama_dokter").value,

        spesialis:
            document.getElementById("edit_spesialis").value,

        no_hp:
            document.getElementById("edit_no_hp").value,

        status_aktif:
            document.getElementById("edit_status_aktif").value

    };

    fetch(`/api/dokter/${id}`, {

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

function hapusDokter(id, nama) {

    Swal.fire({

        title: "Yakin?",
        text: `Hapus ${nama}?`,
        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Ya",

        cancelButtonText: "Batal"

    }).then((result) => {

        if(result.isConfirmed){

            fetch(`/api/dokter/${id}`, {

                method: "DELETE"

            })
            .then(res => res.json())
            .then(data => {

                Swal.fire(
                    "Berhasil",
                    data.message,
                    "success"
                );

                loadDokter();

            });

        }

    });

}