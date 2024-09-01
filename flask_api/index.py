from flask import jsonify
from . import app

@app.route("/test", methods=['GET'])
def test():
    return jsonify({
        "test": "test"
    })
    
if __name__ == '__main__':
    app.run(debug=True)
