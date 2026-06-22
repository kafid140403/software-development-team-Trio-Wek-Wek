console.log("FILE JS TERBACA");

loadKonsultasi();

function loadKonsultasi() {

    console.log("FUNCTION DIPANGGIL");

    fetch("/api/konsultasi")
        .then(res => res.json())
        .then(data => {

            console.log("DATA:", data);

            let html = "";

            data.forEach(k => {

              html += `
<tr>

    <td>${k.id}</td>

    <td>${k.nama}</td>

    <td>${k.keluhan}</td>

    <td>${k.hasil_diagnosa ?? '-'}</td>

    <td>${k.status}</td>

   <td>

    <button
        class="btn btn-primary btn-sm"
        onclick="detailKonsultasi(${k.id})">

        Detail

    </button>

    <button
        class="btn btn-success btn-sm"
        onclick="ubahStatus(${k.id})">

        Selesai

    </button>

    <button
        class="btn btn-danger btn-sm"
        onclick="hapusKonsultasi(${k.id})">

        Hapus

    </button>

</td>

</tr>
`;
            });

            console.log("HTML:", html);

            document.getElementById("konsultasiTable").innerHTML = html;

        })
        .catch(err => {

            console.error("ERROR:", err);

        });

}
function detailKonsultasi(id){

    fetch(`/api/konsultasi/${id}`)
        .then(res => res.json())
        .then(data => {

            document.getElementById("d_user")
                .innerText = data.nama;

            document.getElementById("d_keluhan")
                .innerText = data.keluhan || "-";

            document.getElementById("d_gejala")
                .innerText = data.gejala || "-";

            document.getElementById("d_diagnosa")
                .innerText = data.hasil_diagnosa || "-";

            document.getElementById("d_saran")
                .innerText = data.saran || "-";

            document.getElementById("d_status")
                .innerText = data.status;

            const modal =
                new bootstrap.Modal(
                    document.getElementById("detailModal")
                );

            modal.show();

        });

}
function ubahStatus(id){

    Swal.fire({

        title: "Ubah Status?",

        text: "Jadikan konsultasi selesai?",

        icon: "question",

        showCancelButton: true

    }).then((result)=>{

        if(result.isConfirmed){

            fetch(`/api/konsultasi/status/${id}`,{

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    status:"Selesai"
                })

            })
            .then(res=>res.json())
            .then(data=>{

                Swal.fire(
                    "Berhasil",
                    data.message,
                    "success"
                );

                loadKonsultasi();

            });

        }

    });

}
function hapusKonsultasi(id){

    Swal.fire({

        title:"Yakin?",

        text:"Data konsultasi akan dihapus",

        icon:"warning",

        showCancelButton:true

    }).then((result)=>{

        if(result.isConfirmed){

            fetch(`/api/konsultasi/${id}`,{

                method:"DELETE"

            })
            .then(res=>res.json())
            .then(data=>{

                Swal.fire(
                    "Berhasil",
                    data.message,
                    "success"
                );

                loadKonsultasi();

            });

        }

    });

}