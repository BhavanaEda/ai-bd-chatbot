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

const courses = {

ai:{
title:"Artificial Intelligence",
desc:"ML, deep learning, NLP, computer vision.",
list:[
{name:"Machine Learning Course",link:"https://www.coursera.org/learn/machine-learning"},
{name:"Deep Learning",link:"https://www.deeplearning.ai/"},
{name:"NLP Guide",link:"https://huggingface.co/learn"},
{name:"Computer Vision",link:"https://opencv.org/"}
],
career:"Career Roles: AI Engineer, ML Engineer"
},

ds:{
title:"Data Science",
desc:"Python, analytics, statistics, dashboards.",
list:[
{name:"Python",link:"https://python.org"},
{name:"Statistics",link:"https://www.khanacademy.org/math/statistics-probability"},
{name:"Pandas",link:"https://pandas.pydata.org/docs/"},
{name:"Visualization",link:"https://matplotlib.org/"},
{name:"SQL",link:"https://www.w3schools.com/sql/"}
],
career:"Career Roles: Data Analyst, Data Scientist"
},

cyber:{
title:"Cyber Security",
desc:"Ethical hacking, SOC, VAPT, security tools.",
list:[
{name:"Ethical Hacking",link:"https://www.cybrary.it/"},
{name:"OWASP",link:"https://owasp.org/"},
{name:"SOC Basics",link:"https://www.splunk.com/"},
{name:"Kali Linux",link:"https://www.kali.org/"}
],
career:"Career Roles: Security Analyst, SOC Analyst"
},

genai:{
title:"Generative AI",
desc:"LLMs, RAG, prompt engineering, AI agents.",
list:[
{name:"OpenAI Docs",link:"https://platform.openai.com/docs"},
{name:"Prompt Engineering",link:"https://learnprompting.org/"},
{name:"LangChain",link:"https://python.langchain.com/"},
{name:"HuggingFace",link:"https://huggingface.co/"}
],
career:"Career Roles: GenAI Engineer, AI Developer"
},

embed:{
title:"Embedded Systems",
desc:"IoT, firmware, microcontrollers, RTOS.",
list:[
{name:"Arduino",link:"https://www.arduino.cc/"},
{name:"ESP32",link:"https://www.espressif.com/"},
{name:"RTOS",link:"https://www.freertos.org/"},
{name:"Embedded C",link:"https://www.geeksforgeeks.org/c-programming-language/"}
],
career:"Career Roles: Embedded Engineer"
},

cloud:{
title:"Cloud & DevOps",
desc:"AWS, Docker, Kubernetes, CI/CD.",
list:[
{name:"AWS",link:"https://aws.amazon.com/training/"},
{name:"Docker",link:"https://docs.docker.com/"},
{name:"Kubernetes",link:"https://kubernetes.io/docs/home/"},
{name:"CI/CD",link:"https://www.jenkins.io/"}
],
career:"Career Roles: DevOps Engineer, Cloud Engineer"
},

fullstack:{
title:"Full Stack Development",
desc:"Frontend, backend, databases, deployment.",
list:[
{name:"HTML/CSS",link:"https://www.w3schools.com/"},
{name:"JavaScript",link:"https://javascript.info/"},
{name:"React",link:"https://react.dev/"},
{name:"Node.js",link:"https://nodejs.org/en/docs"},
{name:"MongoDB",link:"https://www.mongodb.com/docs/"}
],
career:"Career Roles: Full Stack Developer"
},

javafs:{
title:"Java Full Stack",
desc:"Java, Spring Boot, React, SQL.",
list:[
{name:"Java",link:"https://www.oracle.com/java/technologies/"},
{name:"Spring Boot",link:"https://spring.io/projects/spring-boot"},
{name:"React",link:"https://react.dev/"},
{name:"SQL",link:"https://www.w3schools.com/sql/"}
],
career:"Career Roles: Java Developer"
},

pythonfs:{
title:"Python Full Stack",
desc:"Python, Django/FastAPI, React, MongoDB.",
list:[
{name:"Python",link:"https://python.org"},
{name:"Django",link:"https://docs.djangoproject.com/"},
{name:"FastAPI",link:"https://fastapi.tiangolo.com/"},
{name:"React",link:"https://react.dev/"},
{name:"MongoDB",link:"https://www.mongodb.com/docs/"}
],
career:"Career Roles: Python Developer"
},

blockchain:{
title:"Blockchain & Web3",
desc:"Smart contracts, Solidity, DApps.",
list:[
{name:"Ethereum",link:"https://ethereum.org/"},
{name:"Solidity",link:"https://soliditylang.org/"},
{name:"Web3.js",link:"https://web3js.readthedocs.io/"},
{name:"Remix IDE",link:"https://remix.ethereum.org/"}
],
career:"Career Roles: Blockchain Developer"
}

};

function showCourse(key){

const c = courses[key];

document.getElementById("title").innerText = c.title;
document.getElementById("desc").innerText = c.desc;
document.getElementById("career").innerText = c.career;

let html = "";

c.list.forEach(item=>{
html += `
<li>
<a href="${item.link}" target="_blank" class="course-link">
${item.name}
</a>
</li>
`;
});

document.getElementById("list").innerHTML = html;

document.getElementById("modal").style.display = "block";
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