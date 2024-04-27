from transformers import BertTokenizer, BertModel
import torch
from sklearn.metrics.pairwise import cosine_similarity
import json

class FindTopSimTags:
    def __init__(self,tags=[],taglist=[],topn=20):
        self.tags = tags
        self.taglist = taglist
        self.topn = topn
        self.result = []
    def findSimTags(self):
        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        model = BertModel.from_pretrained('bert-base-uncased')

        hidden_states_taglist = []
        for word in self.taglist:
            inputs_word = tokenizer(word, return_tensors="pt", padding=True, truncation=True)
            with torch.no_grad():
                outputs_word = model(**inputs_word)
            hidden_states_taglist.append({"word":word,"last_hidden_state":outputs_word.last_hidden_state[:, 0, :]})
        
        # transfer to BERT inputs
        for tag in self.tags:
            inputs_given = tokenizer(tag, return_tensors="pt", padding=True, truncation=True)

            # BERT outputs
            with torch.no_grad():
                outputs_given = model(**inputs_given)
            
            # last hidden state
            hidden_states_given = outputs_given.last_hidden_state[:, 0, :]
            # calc similarities
            similarities = []

            for hidden_states_word in hidden_states_taglist:
                similarity = cosine_similarity(hidden_states_given.numpy(),hidden_states_word["last_hidden_state"].numpy())[0][0]
                similarities.append((hidden_states_word["word"], float(similarity)))
            
            
            # find top n words
            top_n_similar_words = sorted(similarities, key=lambda x: x[1], reverse=True)[:self.topn]

            self.result.append({"tag":tag,"similarity":dict(top_n_similar_words)})
        return json.dumps(self.result)
