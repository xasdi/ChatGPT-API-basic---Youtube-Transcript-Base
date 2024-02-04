const questionInput = document.getElementById("question");
const sendQuestionButton = document.getElementById("sendQuestion");
const youtubeLinkInput = document.getElementById("youtubeLink");
const sendLinkButton = document.getElementById("sendLink");
const responseText = document.getElementById("response");
const transcriptionText = document.getElementById("transcriptionpreview");
const dialog = document.getElementById("entercontextsource");
const messagesbox = document.getElementById("messages");


var linkfocus = false;
var questionfocus = false;




function makenewchat(){
  dialog.showModal();
}

function resetcontext(){
  history = [];
}

function createnewchat(){

}

function confirmcreation(){
  dialog.close();
  var systemmessagebox = document.createElement("div");
  var systemmessagecontent = document.createElement("div");
  systemmessagebox.classList.add("message", "usermessage");
  systemmessagecontent.innerHTML = "Transcription recieved by AI, ask all you want!";

  systemmessagebox.appendChild(systemmessagecontent);
  messagesbox.appendChild(systemmessagebox);
  document.getElementById("questioninput").style.display = "flex";
  
}

function cancelcreation(){
  dialog.close();
}

youtubeLinkInput.addEventListener("focus", () => {
  linkfocus = true;
  questionfocus = false;
})

questionInput.addEventListener("focus", () => {
  linkfocus = false;
  questionfocus = true;
})

document.addEventListener("keydown", (event) => {
  if(event.key === "Enter"){
    if(linkfocus){
      alert("przesłano link");
    }
    if(questionfocus){
      alert("przesłano zapytanie");
    }
  }
})

sendQuestionButton.addEventListener("click", async () => {
  const user_input = questionInput.value;
  
  var newusermessagebox = document.createElement("div");
  var usermessagecontent = document.createElement("div");
  newusermessagebox.classList.add("message", "usermessage");
  usermessagecontent.innerHTML = user_input;

  messagesbox.appendChild(newusermessagebox);
  newusermessagebox.appendChild(usermessagecontent);
  
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: user_input}),
  });

  const responseData = await response.json();

  var newaimessagebox = document.createElement("div");
  var aimessagecontent = document.createElement("div");
  newaimessagebox.classList.add("message", "aimessage");
  aimessagecontent.innerHTML = responseData.response;
  
  newaimessagebox.appendChild(aimessagecontent);
  messagesbox.appendChild(newaimessagebox);
  


  
  
  
  questionInput.value = null;
});

sendLinkButton.addEventListener("click", async () => {
  const youtube_url = youtubeLinkInput.value;
  console.log(youtube_url);
  
  const response = await fetch("http://127.0.0.1:3000/server/transcribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: youtube_url }),
    
  });

  const responseData = await response.json();
  transcriptionText.value = responseData.transcription;
 
});


async function checkemail(){
  var emailtocheck = document.getElementById("emailinput").value;

  const response = await fetch("http://127.0.0.1:5000/checkemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tocheckemail: emailtocheck })
    }); 
    const responsemessage = await response.json();
    var emailstatus = responsemessage.emailcheckstatus;
    console.log(emailstatus)
    if(emailstatus == "true"){
      document.getElementById("emailinput").style.backgroundColor = "red"
    }
    if(emailstatus == "false"){
      document.getElementById("emailinput").style.backgroundColor = "green"
    }
}

async function sendNewAccData(){
  let password = document.getElementById("password");
  let cpassword = document.getElementById("cpassword");
  let email = document.getElementById("emailinput");
  let username = document.getElementById("usernameinput");
  
  let newaccdataarray = [username.value, password.value, email.value]

  if(password.value === cpassword.value){

    alert("Wszystko jest ok!");
    const response = await fetch("http://127.0.0.1:5000/dbcreate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accdata: newaccdataarray }),
    }); 
    const responsemessage = await response.json();
    alert("przeslano info" + responsemessage.amabatukam);

  }else{
    alert("Hasła się różnią!");
    password.value = "";
    cpassword.value = "";
  }
  
  



}