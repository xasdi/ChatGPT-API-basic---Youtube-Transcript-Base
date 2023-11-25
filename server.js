const express = require("express");
const app = express();
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");
const history = [];
require("dotenv").config();

// Dodaj parser ciała żądania dla POST requestów
app.use(express.json());

// Ustawienie folderu publicznego dla plików statycznych (np. index.html, index.js, itp.)
app.use(express.static(path.join(__dirname, "public")));

// Endpoint obsługujący żądanie GET dla ścieżki głównej "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/index.js", (req, res) => {
  res.set("Content-Type", "application/javascript"); // Ustawienie odpowiedniego Content-Type
  res.sendFile(path.join(__dirname, "index.js"));
});



app.post("/server/transcribe", async (req, res) => {
  const youtube_url = req.body.url;
  console.log("req body wartosc",req.body)
  console.log("Przekazany link:", youtube_url);

  // Przekieruj zapytanie do serwera Pythona
  const pythonServerUrl = "http://127.0.0.1:5000/transcribe";
  const pythonResponse = await fetch(pythonServerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: youtube_url }),
  });

  const pythonData = await pythonResponse.json();

  

  const transcription = pythonData.transcription;

  const subhistory = [transcription + " to transkrypcja filmu, odpowiedz na pytania które ci zadam na jej podstawie", ''];
  history.push(subhistory);
  
  console.log("podano kontekst" + history)
  // Zwróć transkrypcję jako odpowiedź
  res.json({ transcription: transcription, done: "taskended" });
});

// Endpoint obsługujący żądanie POST dla ścieżki "/api/chat"
app.post("/api/chat", async (req, res) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const user_input = req.body.message;
  
  console.log(history);
 
  
  const messages = [];
  for (const [input_text, completion_text] of history) {
    messages.push({ role: "user", content: input_text });
    messages.push({ role: "assistant", content: completion_text });
  }

  messages.push({ role: "user", content: user_input });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const completion_text = completion.data.choices[0].message.content;
    res.json({ response: completion_text });

    history.push([user_input, completion_text]);
    
  } catch (error) {
    console.log("Wystąpił błąd:");
    console.log(error.message);
    res.status(500).json({ error: "Wystąpił błąd podczas komunikacji z AI." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`, history);
});

