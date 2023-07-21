from flask import Flask, request, jsonify
from flask_cors import CORS
from pytube import YouTube
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return "Hello, this is the home page!"

@app.route("/transcribe", methods=["POST"])
def transcribe():
    youtube_url = request.json.get("url")
    print(request.json)
    print("Otrzymany link:", youtube_url)

    if not youtube_url:
        return jsonify({"error": "Nie podano linku do filmu YouTube."})

    try:
        video_url = youtube_url
        # download the video
        yt = YouTube(video_url)
        

        # extract the transcript
        transcript_list = YouTubeTranscriptApi.get_transcript(yt.video_id)

        # get the transcript text without timestamps
        transcript = "\n".join(line["text"] for line in transcript_list)

        return jsonify({"transcription": transcript})
    except Exception as e:
        return jsonify({"error": f"Wystąpił błąd: {e}"})


app.run(debug=True)
