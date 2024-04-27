from flask import Flask
from flask import request
from tagsim import FindTopSimTags
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.post("/tagsim")
def hello_world():
    newFinding = FindTopSimTags(request.json["tag"],request.json["taglist"],request.json["topn"])
    result = newFinding.findSimTags()
    return result