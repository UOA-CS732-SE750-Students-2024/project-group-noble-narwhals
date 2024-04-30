# Tag similarity calculate restful API

## Introduction

This is a python programme, and required to install python 3.  
Python 3 can be downloaded form [https://www.python.org/downloads/](https://www.python.org/downloads/)  
This programme based on pre-trained BERT model `bert-base-uncased` from [Hugging face](https://huggingface.co/)

## Installation

After installing python 3, change to current directory.
You may like to create a new virtual environment to run the programme.

```sh
# Create a virtual environment named .venv
# This will create a new folder named .venv in current directory.
# Remember to add this directory to .gitignore
python -m venv .venv

# activate the virtual environment
# Windows
.venv\Scripts\activate
# Unix or MacOS
source .venv/bin/activate
```

Install dependencies

```sh
pip install -r requirements.txt
```

Note: If you are using MacOS M series chip, you may need to install the comments in the requirements.txt file manually.

````sh
## Run HTTP Server
Change directory to scripts.
```sh
cd script
````

Run the server

```sh
flask run

or

flask run -h localhost -p 5050
```

The server will be running on 5000 port

## Request

Send a POST request.  
The first request will take some time to download the pre-trained model.
Return words and similarities

```jsx
// sample
POST `{$url}/tagsim`
Content-Type: application/json

{
    "tag":["fishing","develop"],
    "taglist":["computer", "react", "CSS", "javascript", "AI",
                "commerce", "management", "IT","CS732", "CS751", "INFOSYS703",
                "statistics", "R", "seafood", "entertainment","fish", "outdoor"],
    "topn":20 // will return top 20 words
}

// returns
[
  {
    "tag": "fishing",
    "similarity": {
      "seafood": 0.9303056001663208,
      "fish": 0.9295727014541626,
      "statistics": 0.8940508365631104,
      "management": 0.8886011838912964,
      "entertainment": 0.8846619725227356,
      "outdoor": 0.8837976455688477,
      "computer": 0.8775097727775574,
      "AI": 0.866996705532074,
      "javascript": 0.8646419048309326,
      "commerce": 0.8633949160575867,
      "IT": 0.8496536016464233,
      "react": 0.8483951687812805,
      "R": 0.8421317338943481,
      "CS751": 0.8286702632904053,
      "CSS": 0.8127241134643555,
      "INFOSYS703": 0.8056865930557251,
      "CS732": 0.8001353740692139
    }
  },
  {
    "tag": "develop",
    "similarity": {
      "react": 0.9275064468383789,
      "AI": 0.8940747976303101,
      "IT": 0.8925415873527527,
      "management": 0.8908156156539917,
      "computer": 0.8887989521026611,
      "statistics": 0.8825044631958008,
      "R": 0.8780611157417297,
      "entertainment": 0.8751676082611084,
      "CSS": 0.8618200421333313,
      "fish": 0.8590875267982483,
      "seafood": 0.8573973178863525,
      "javascript": 0.8557108044624329,
      "CS751": 0.8513858318328857,
      "outdoor": 0.847282350063324,
      "CS732": 0.8376177549362183,
      "INFOSYS703": 0.823669970035553,
      "commerce": 0.7847232222557068
    }
  }
]
```
