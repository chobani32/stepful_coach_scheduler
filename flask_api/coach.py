from flask import request, jsonify
from . import app
from datetime import datetime, timedelta
from .helper import create_connection, get_open_slots

@app.route("/coach/<string:coach_id>", methods=['GET'])
def coach(coach_id):
    db = create_connection()
    
    phone_number = db.execute(f"""
                      SELECT phone_number FROM coaches
                      WHERE id is "{coach_id}";
                      """).fetchone()
    if (phone_number != None):
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        appointments = db.execute(f"""
                      SELECT a.start_time, a.student_id, s.phone_number 
                      FROM appointments a
                      LEFT JOIN students s
                      ON a.student_id = s.id
                      WHERE coach_id is "{coach_id}"
                      AND student_id is not null
                      AND past is false
                      ORDER BY start_time ASC;
                      """).fetchall()

        return jsonify({
            "coach_id": coach_id,
            "phone_number": phone_number[0],
            "appointments": appointments,
            "past_appointments": past_appointments(db, coach_id),
            "open_slots": get_open_slots(db, coach_id),
        })
    
    return jsonify({
            "coach_id": "No match",
        })

@app.route("/coach/submit_review/<string:coach_id>", methods=['POST'])
def submit_review(coach_id):
    db = create_connection()

    body = request.get_json(force=True)
    print(body)

    coach_id = body["coach_id"]
    datetime = body["apt_time"]
    rating = body["rating"]
    review = body["review"]

    if rating != 0:
        db.execute(f"""
            UPDATE appointments
            SET rating={rating}
            WHERE coach_id="{coach_id}"
            AND start_time="{datetime}"
        """)
        db.commit()
    if review != "":
        db.execute(f"""
            UPDATE appointments
            SET review="{review}"
            WHERE coach_id="{coach_id}"
            AND start_time="{datetime}"
        """)
        db.commit()

    return jsonify({
        "coach_id": coach_id,
        "past_appointments": past_appointments(db, coach_id),
    })

@app.route("/coach/open_slots/<string:coach_id>", methods=['GET', 'POST'])
def coach_open_slots(coach_id):
    db = create_connection()

    slot_added = False
    open_slots = get_open_slots(db, coach_id)
    reason = ""

    # add open slot
    if request.method == 'POST':
        body = request.get_json(force=True)
        print(body)

        date = datetime.strptime(body["date"].split('T')[0], "%Y-%m-%d")
        time = body["time"]
        new_slot_start_time = date.replace(hour=int(time))
        new_slot_end_time = new_slot_start_time + timedelta(hours=2)

        add_new_slot = True

        if new_slot_start_time <= datetime.now() or new_slot_end_time <= datetime.now():
            add_new_slot = False
            reason = "slot in the past"
        print(f"new start: {new_slot_start_time}")
        print(f"new end: {new_slot_end_time}")
        for s in open_slots:
            start_time = datetime.strptime(s, '%Y-%m-%d %H:%M:%S')
            end_time = start_time + timedelta(hours=2)
            if (new_slot_end_time > start_time and new_slot_end_time <= end_time) or new_slot_start_time < end_time and new_slot_start_time >= start_time:
                add_new_slot = False
                reason = f"slot conflicts with another slot: {new_slot_start_time.strftime('%Y-%m-%d %H:%M:%S')}"
                break

        if add_new_slot:
            formatted_datetime = new_slot_start_time.strftime('%Y-%m-%d %H:%M:%S')
            db.execute(f"""
                INSERT INTO appointments (start_time, coach_id)
                VALUES ("{formatted_datetime}", "{coach_id}");
                """)
            db.commit()
            slot_added = True

    
    return jsonify({
            "coach_id": coach_id,
            "open_slots": get_open_slots(db, coach_id),
            "slot_added": slot_added,
            "reason": reason,
        })

def past_appointments(db, coach_id):
   return db.execute(f"""
                      SELECT start_time, student_id, rating, review
                      FROM appointments
                      WHERE coach_id is "{coach_id}"
                      AND past is true
                      ORDER BY start_time DESC;
                      """).fetchall()



    
if __name__ == '__main__':
    app.run(debug=True)
