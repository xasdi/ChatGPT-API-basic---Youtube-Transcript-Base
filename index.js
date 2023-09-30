const questionInput = document.getElementById("question");
const sendQuestionButton = document.getElementById("sendQuestion");
const youtubeLinkInput = document.getElementById("youtubeLink");
const sendLinkButton = document.getElementById("sendLink");
const responseText = document.getElementById("response");
const transcriptionText = document.getElementById("transcriptionpreview");
const dialog = document.getElementById("entercontextsource");

var linkfocus = false;
var questionfocus = false;
var messageHistory = [];

function makenewchat(){
  dialog.showModal();
}

function createnewchat(){

}

function confirmcreation(){
// do zrobienia
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
  
  
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: user_input}),
  });

  const responseData = await response.json();
  responseText.innerHTML = responseData.response;
  
  
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