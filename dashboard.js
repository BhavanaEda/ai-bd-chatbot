async function loadStats(){
try{
const res = await fetch("/analytics");
const data = await res.json();

document.getElementById("contacts").innerText = data.contacts || 0;
document.getElementById("messages").innerText = data.messages || 0;

let revenue = (data.contacts || 0) * 2500;
document.getElementById("revenue").innerText =
"₹" + revenue.toLocaleString();

}catch(err){
console.log(err);
}
}

loadStats();

new Chart(document.getElementById("pieChart"),{
type:"pie",
data:{
labels:["New Leads","Interested","Converted"],
datasets:[{
data:[40,35,25]
}]
}
});

new Chart(document.getElementById("barChart"),{
type:"bar",
data:{
labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
datasets:[{
label:"Leads",
data:[2,4,3,6,5,7,8]
}]
}
});