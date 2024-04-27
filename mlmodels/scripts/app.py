from flask import Flask
from flask import request
from tagsim import FindTopSimTags

app = Flask(__name__)

@app.post("/tagsim")
def hello_world():
    newFinding = FindTopSimTags(request.json["tag"],request.json["taglist"],request.json["topn"])
    result = newFinding.findSimTags()
    return result