loadUsers();

function loadUsers() {

    fetch("/api/users")
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(user => {

                html += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.nama}</td>
                        <td>${user.no_whatsapp}</td>
                        <td>${user.alamat}</td>
                        <td>${user.tanggal_lahir}</td>
                        <td>${user.jenis_kelamin}</td>
                        <td>${user.created_at}</td>
                        <td>${user.state}</td>
                        <td>

    <button
        class="btn btn-warning btn-sm"
        onclick="editUser(${user.id})">

        Edit

    </button>

   <button
    class="btn btn-danger btn-sm"
    onclick="hapusUser(${user.id}, '${user.nama}')">

    Hapus

</button>
</td>
                    </tr>
                `;

            });

            document.getElementById("userTable").innerHTML = html;

        });

}
function editUser(id) {

    fetch(`/api/users/${id}`)
        .then(res => res.json())
        .then(user => {

            document.getElementById("edit_id").value =
                user.id;

            document.getElementById("edit_nama").value =
                user.nama || "";

            document.getElementById("edit_no_whatsapp").value =
                user.no_whatsapp || "";

            document.getElementById("edit_alamat").value =
                user.alamat || "";

            document.getElementById("edit_tanggal_lahir").value =
                user.tanggal_lahir || "";

            document.getElementById("edit_jenis_kelamin").value =
                user.jenis_kelamin || "";

            const modal =
                new bootstrap.Modal(
                    document.getElementById("editModal")
                );

            modal.show();

        });

}
function updateUser() {

    const id =
        document.getElementById("edit_id").value;

    const data = {

        nama:
            document.getElementById("edit_nama").value,

        no_whatsapp:
            document.getElementById("edit_no_whatsapp").value,

        alamat:
            document.getElementById("edit_alamat").value,

        tanggal_lahir:
            document.getElementById("edit_tanggal_lahir").value,

        jenis_kelamin:
            document.getElementById("edit_jenis_kelamin").value

    };

    fetch(`/api/users/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    })
    .then(res => res.json())
    .then(result => {

        alert(result.message);

        location.reload();

    });

}
function hapusUser(id, nama) {

    Swal.fire({

        title: "Yakin?",
        text: `User ${nama} akan dihapus`,
        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Ya, Hapus",

        cancelButtonText: "Batal"

    }).then((result) => {

        if (result.isConfirmed) {

            fetch(`/api/users/${id}`, {

                method: "DELETE"

            })
            .then(res => res.json())
            .then(data => {

                Swal.fire({

                    icon: "success",

                    title: "Berhasil",

                    text: data.message

                }).then(() => {

                    loadUsers();

                });

            });

        }

    });

}