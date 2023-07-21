from flask import Flask, render_template, request
from pytube import YouTube
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/transcript', methods=['POST'])
def transcript():
    video_url = request.form['video_url']
    try:
        # download the video
        yt = YouTube(video_url)
        video_path = yt.streams.get_audio_only().download()

        # extract the transcript
        transcript_list = YouTubeTranscriptApi.get_transcript(yt.video_id)

        # format the transcript with timestamps
        transcript = []
        for line in transcript_list:
            text = line['text']
            transcript.append({'text': text})
      
        # display the transcript
        return render_template('transcript.html', transcript=transcript)
    except Exception as e:  # Używamy ogólnego wyjątku Exception, aby przechwycić wszystkie wyjątki
        # Wypisz wyjątek do konsoli
        print(f"Error occurred: {e}")
        # Wyświetl stronę błędu
        return render_template('error.html')

# Obsługa błędów 404 (strona nie znaleziona)
@app.errorhandler(404)
def page_not_found(error):
    return render_template('error.html', error_message="Page not found"), 404

# Obsługa błędów 500 (błąd serwera)
@app.errorhandler(500)
def internal_server_error(error):
    return render_template('error.html', error_message="Internal server error"), 500



if __name__ == '__main__':
    app.run(debug=True)
