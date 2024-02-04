import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="newuser",
  password="Klipero1",
  database="users_database"
)

mycursor = mydb.cursor()

# Przykładowe dane użytkownika
username = "example_user122"
password = "example_password122"
welcome_message = "Welcome to our platform!"

# Polecenie SQL do dodania nowego rekordu
sql = "INSERT INTO users (username, password, welcome_message) VALUES (%s, %s, %s)"
values = (username, password, welcome_message)

mycursor.execute(sql, values)

mydb.commit()  # Potwierdzenie zmian w bazie danych

print("Dodano nowego użytkownika!")


    