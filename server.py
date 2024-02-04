from flask import Flask, request, jsonify
from flask_cors import CORS
from pytube import YouTube
from youtube_transcript_api import YouTubeTranscriptApi
import mysql.connector

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

@app.route("/checkemail", methods=["POST"])
def checkemail():
    emailtocheck = request.json.get("tocheckemail")
    print(emailtocheck)
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="users_database"
    )
    mycursor = mydb.cursor()
    sql = "SELECT * FROM users WHERE email = %s"
    value = (emailtocheck,)

    mycursor.execute(sql, value)
    result = mycursor.fetchall()

    if result:
        mycursor.close()
        return jsonify({"emailcheckstatus": "true"})
    else:
        mycursor.close()
        return jsonify({"emailcheckstatus": "false"})

@app.route("/dbcreate", methods=["POST"])
def dbcreate():
    newaccdata = request.json.get("accdata")
    newusername = newaccdata[0]
    newpassword = newaccdata[1]
    newemail = newaccdata[2]

    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="users_database"
    )

    mycursor = mydb.cursor()
    # Zapytanie sprawdzające czy dane istnieją
    sql = "SELECT * FROM users WHERE email = %s"
    value = (newemail,)

    mycursor.execute(sql, value)
    result = mycursor.fetchall()

    if result:
        mycursor.close()
        return jsonify({"amabatukam": "dane istnieją"})
    else:
        mycursor = mydb.cursor()
        sql = "INSERT INTO users (username, password, email) VALUES (%s, %s, %s)"
        values = (newusername, newpassword, newemail)
        mycursor.execute(sql, values)
        mydb.commit()
        mycursor.close()
        return jsonify({"amabatukam": newaccdata})
    
@app.route("/loginuser", methods=["POST"])
def loginuser():
    logindata = request.json.get("logindata")
    username = logindata[0]
    password = logindata[1]

    mydb = mysql.connector.connect(
        host="localhost",
        user="newuser",
        password="Klipero1",
        database="users_database"
    )

    mycursor = mydb.cursor()

   

    sql = "SELECT * FROM users WHERE username = %s AND password = %s"
    values = (username, password)

    mycursor.execute(sql, values)

    result = mycursor.fetchall()

    if result:
        print("Zaraz nastąpi zalogowanie")
        mycursor.close()
        mydb.close()
        return jsonify({"usertologin": "true"})
    else:
        print("Login lub hasło są nieprawidłowe")
        mycursor.close()
        mydb.close()
        return jsonify({"usertologin": "false"})
   


    


app.run(debug=True)
