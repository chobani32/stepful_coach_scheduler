from flask import request, jsonify
from . import app
from .helper import create_connection, get_open_slots
import datetime

@app.route("/student/<string:student_id>", methods=['GET'])
def student(student_id):
    appointments = []
    phone_number = None

    db = create_connection()
    
    phone_number = db.execute(f"""
                      SELECT phone_number FROM students
                      WHERE id is "{student_id}";
                      """).fetchone()
    coaches = [c[0] for c in db.execute(f"""
               SELECT id
               FROM coaches;
               """).fetchall()]
    if (phone_number != None):
        return jsonify({
            "student_id": student_id,
            "phone_number": phone_number[0],
            "appointments": get_appointments(db, student_id),
            "coaches_list": coaches
        })
    
    print(f"No student data found for {student_id}")
    return jsonify({
            "student_id": "No match",
        })
    # TODO handle error

@app.route("/student/schedule", methods=['POST'])
def schedule_appoinment():
    db = create_connection()

    body = request.get_json(force=True)
    print(body)

    student_id = body["student_id"]
    coach_id = body["coach_id"]
    start_time = body["start_time"]

    db.execute(f"""
               UPDATE appointments
               SET student_id="{student_id}"
               WHERE coach_id is "{coach_id}"
               AND start_time is "{start_time}";
               """)
    db.commit()

    return jsonify({
        "student_id": student_id,
        "appointments": get_appointments(db, student_id),
        "open_slots": get_open_slots(db, coach_id)
    })

def get_appointments(db, student_id):
    return db.execute(f"""
                      SELECT a.start_time, a.coach_id, c.phone_number 
                      FROM appointments a
                      LEFT JOIN coaches c
                      ON a.coach_id = c.id
                      WHERE student_id is "{student_id}"
                      ORDER BY start_time ASC;
                      """).fetchall()
    
if __name__ == '__main__':
    app.run(debug=True)
