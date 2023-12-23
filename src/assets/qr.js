alert("HOOLLLAAAAA");
function generarQr(codigo){
	const contenedorQr = document.getElementById('contenedorQR');
	new QRCode(contenedorQr, codigo);
}




