from sqlite3 import Error
import sqlite3

SCHEDULER_DB  = 'db/scheduler.db'

def create_connection():
    connection = None
    try:
        connection = sqlite3.connect(SCHEDULER_DB)
        print("Connection to SQLite DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")

    return connection   