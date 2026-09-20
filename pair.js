<!DOCTYPE html>
<html>
<head>
<title>QUEEN-MD PAIR</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{background:#0a0a0a;color:white;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;font-family:sans-serif}
.box{background:#1a1a1a;padding:25px;border-radius:15px;text-align:center;width:88%;max-width:380px}
input{width:90%;padding:12px;border-radius:25px;border:none;text-align:center;margin-top:10px}
button{width:95%;padding:12px;background:#25D366;color:white;border:none;border-radius:25px;font-weight:bold;margin-top:12px}
.tabs button{width:45%;background:#333}
.tabs button.active{background:#25D366}
#qrBox{display:none}
#result{margin-top:15px;color:#25D366;font-size:22px;letter-spacing:2px}
</style>
</head>
<body>
<div class="box">
<h2>👑 QUEEN-MD</h2>
<div class="tabs">
<button id="b1" class="active" onclick="showPair()">Pair Code</button>
<button id="b2" onclick="showQr()">QR Code</button>
</div>

<div id="pairBox">
<p>Number likho 92300xxxxxx</p>
<input id="num" placeholder="92300xxxxxx">
<button onclick="getCode()">GET PAIR CODE</button>
<div id="result"></div>
</div>

<div id="qrBox">
<p>WhatsApp se QR Scan karo</p>
<button onclick="getQr()">GET QR</button>
<div id="qrAgya" style="margin-top:15px"></div>
</div>
</div>

<script>
function showPair(){pairBox.style.display="block";qrBox.style.display="none";b1.classList.add("active");b2.classList.remove("active")}
function showQr(){pairBox.style.display="none";qrBox.style.display="block";b2.classList.add("active");b1.classList.remove("active")}
async function getCode(){
let n=document.getElementById("num").value;
if(!n) return alert("number likho");
result.innerText="Wait...";
let r=await fetch(`/code?number=${n}`);
let d=await r.json();
result.innerText=d.code||"Error";
}
async function getQr(){
qrAgya.innerHTML="Loading...";
let r=await fetch(`/qr`);
let d=await r.json();
qrAgya.innerHTML=`<img src="${d.qr}" style="width:260px;background:white;padding:10px;border-radius:10px">`;
}
</script>
</body>
</html>
