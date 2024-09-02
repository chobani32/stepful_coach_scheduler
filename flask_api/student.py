from flask import request, jsonify
from . import app
from .helper import create_connection
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
        appointments = db.execute(f"""
                      SELECT a.start_time, a.coach_id, c.phone_number 
                      FROM appointments a
                      LEFT JOIN coaches c
                      ON a.coach_id = c.id
                      WHERE student_id is "{student_id}"
                      ORDER BY start_time ASC;
                      """).fetchall()

        return jsonify({
            "student_id": student_id,
            "phone_number": phone_number[0],
            "appointments": appointments,
            "coaches_list": coaches
        })
    
    print(f"No student data found for {student_id}")
    # TODO handle error

@app.route("/student/schedule", methods=['POST'])
def schedule_appoinment():
    db = create_connection()

    body = request.get_json(force=True)
    print(body)

    db.execute(f"""
               UPDATE appointments
               SET student_id="{body.get("student_id")}"
               WHERE coach_id="{body.get("coach_id")}"
               AND start_time="{body.get("start_time")}")
               """)
    db.commit()
    
if __name__ == '__main__':
    app.run(debug=True)
