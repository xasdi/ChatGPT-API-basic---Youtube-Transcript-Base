const questionInput = document.getElementById("question");
const sendQuestionButton = document.getElementById("sendQuestion");
const youtubeLinkInput = document.getElementById("youtubeLink");
const sendLinkButton = document.getElementById("sendLink");
const responseText = document.getElementById("response");
const transcriptionText = document.getElementById("transcription");

sendQuestionButton.addEventListener("click", async () => {
  const user_input = questionInput.value;
  const contexttxt = transcriptionText.innerHTML;
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: user_input, history: []}),
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
  transcriptionText.innerHTML = responseData.transcription;
 
});