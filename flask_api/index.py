from flask import jsonify
from . import app
from .helper import create_connection

@app.route("/test", methods=['GET'])
def test():
    coaches = []

    db = create_connection()
    coaches = db.execute(f"""
                      SELECT * FROM coaches;
                      """).fetchall()
    
    return jsonify({
        "test": coaches
    })
    
if __name__ == '__main__':
    app.run(debug=True)
