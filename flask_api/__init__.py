from flask import Flask

app = Flask(__name__)

from . import index, student, coach
