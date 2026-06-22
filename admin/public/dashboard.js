fetch("/api/dashboard")
.then(res => res.json())
.then(data => {

    document.getElementById("total_users")
        .innerText = data.total_users;

    document.getElementById("total_dokter")
        .innerText = data.total_dokter;

    document.getElementById("total_obat")
        .innerText = data.total_obat;

    document.getElementById("total_konsultasi")
        .innerText = data.total_konsultasi;

});