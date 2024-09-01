from flask import jsonify
from . import app
from .helper import create_connection

@app.route("/test", methods=['GET'])
def test():
    appointments = []

    db = create_connection()
    appointments = db.execute(f"""
                      SELECT * FROM appointments;
                      """).fetchall()
    
    return jsonify({
        "appointments": appointments
    })
    
if __name__ == '__main__':
    app.run(debug=True)
