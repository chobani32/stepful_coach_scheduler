from sqlite3 import Error
import sqlite3
import datetime

SCHEDULER_DB  = 'db/scheduler.db'

def create_connection():
    connection = None
    try:
        connection = sqlite3.connect(SCHEDULER_DB)
        print("Connection to SQLite DB successful")
        update_appointments(connection)
    except Error as e:
        print(f"The error '{e}' occurred")

    return connection 


def update_appointments(db):
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    db.execute(f"""
            DELETE FROM
            appointments
            WHERE student_id is null
            AND start_time <= "{now}";
            """)

    db.execute(f"""
            UPDATE appointments
            SET past=true
            WHERE start_time <= "{now}";
            """)
    db.commit()

    print("Appointments updated")