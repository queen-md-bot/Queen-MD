<!DOCTYPE html>
<html>
<head>
<title>QUEEN-MD PAIR</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{background:#0a0a0a;color:white;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;margin:0}
.box{background:#1a1a1a;padding:30px;border-radius:15px;text-align:center;width:90%;max-width:350px;box-shadow:0 0 20px #25D36644}
input{width:90%;padding:12px;border-radius:8px;border:none;margin-top:15px;font-size:16px;text-align:center}
button{width:95%;padding:12px;background:#25D366;color:white;border:none;border-radius:8px;font-size:16px;font-weight:bold;margin-top:15px;cursor:pointer}
button:active{transform:scale(0.98)}
#result{margin-top:20px;font-size:20px;font-weight:bold;color:#25D366;letter-spacing:2px;word-break:break-all}
</style>
</head>
<body>
<div class="box">
<h2>👑 QUEEN-MD</h2>
<p>Number likho country code ke sath<br>Example: 923001234567</p>
<input type="number" id="num" placeholder="9230xxxxxxxx">
<button id="btn" onclick="getCode()">GET PAIR CODE</button>
<div id="result"></div>
<p id="msg" style="font-size:12px;color:#aaa;margin-top:15px"></p>
</div>

<script>
async function getCode(){
let number=document.getElementById("num").value;
let result=document.getElementById("result");
let btn=document.getElementById("btn");
let msg=document.getElementById("msg");
if(!number){alert("Pehle number likho");return}
btn.innerText="WAIT...";
result.innerText="";
msg.innerText="Code generate ho raha hai, 20 sec wait karo...";
try{
let res=await fetch("/?number="+number);
let data=await res.json();
if(data.code){
result.innerText=data.code;
msg.innerText="WhatsApp > Linked Devices > Link with phone number > Ye code paste karo";
btn.innerText="COPY CODE";
btn.onclick=()=>{navigator.clipboard.writeText(data.code); alert("Copied: "+data.code)}
}else{
result.innerText=data.message || "Error";
btn.innerText="TRY AGAIN";
}
}catch(e){
result.innerText="Server Error, Dobara try karo";
btn.innerText="GET PAIR CODE";
}
}
</script>
</body>
</html>
