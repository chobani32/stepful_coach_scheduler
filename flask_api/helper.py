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

def get_open_slots(db, coach_id):
    return [s[0] for s in db.execute(f"""
                      SELECT start_time 
                      FROM appointments
                      WHERE coach_id is "{coach_id}"
                      AND student_id is null
                      ORDER BY start_time ASC;
                      """).fetchall()]