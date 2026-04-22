async function loadStats(){
try{

const res = await fetch("/analytics");
const data = await res.json();

const leads = data.contacts || 0;
const messages = data.messages || 0;

document.getElementById("totalLeads").innerText = leads;
document.getElementById("totalMessages").innerText = messages;

let revenue = leads * 30000;

document.getElementById("revenue").innerText =
"₹" + revenue.toLocaleString();

renderCharts(leads, messages);

}catch(err){
console.log(err);
}
}
async function sendChat(){

const msg = document.getElementById("chatInput").value;

const res = await fetch('/chat',{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body: JSON.stringify({
message: msg,
user_id: "user1"
})
});

const data = await res.json();

document.getElementById("chatReply").innerText =
data.reply;
}

function renderCharts(leads, messages){

const pieCtx = document.getElementById("pieChart").getContext("2d");
const barCtx = document.getElementById("barChart").getContext("2d");

new Chart(pieCtx,{
type:"pie",
data:{
labels:["Leads","Messages","Converted"],
datasets:[{
data:[leads,messages,Math.floor(leads*0.3)],
backgroundColor:[
"#3b82f6",
"#10b981",
"#8b5cf6"
],
borderWidth:1
}]
},
options:{
responsive:true,
maintainAspectRatio:false
}
});

new Chart(barCtx,{
type:"bar",
data:{
labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
datasets:[{
label:"Weekly Leads",
data:[2,4,3,6,5,7,leads],
backgroundColor:"#3b82f6",
borderWidth:1
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
scales:{
y:{
beginAtZero:true
}
}
}
});

}

loadStats();