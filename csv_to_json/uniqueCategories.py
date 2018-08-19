# -*- coding: utf-8 -*-
"""
Created on Sat Aug 18 20:36:52 2018

@author: andre
"""

import pandas as pd
import json
from random import randint
print(randint(1, 11))

dt = pd.read_csv("/Users/khantil/Developer/hacakthons/Team8/csv_to_json/catalog_export.csv", encoding="latin")

np_array_to_list = dt['CategoryName'].unique().tolist()

with open("categories.json", "w") as f:
    list_items = []
    for v in np_array_to_list:
        randomint = randint(1, 5)
        print(f'{randomint}')
        myobj = {
            'category': v, 
            'img': f'./img/img{randomint}.jpeg'}
        list_items.append(myobj)
    out = json.dumps(list_items)
    
    #json.dump(out, fp=f)
    f.write(out)