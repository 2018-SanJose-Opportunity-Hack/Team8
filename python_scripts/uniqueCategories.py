# -*- coding: utf-8 -*-
"""
Created on Sat Aug 18 20:36:52 2018

@author: andre
"""

import pandas as pd
import json

dt = pd.read_csv("catalog_export.csv", encoding="latin")

np_array_to_list = dt['ActivityName'].unique().tolist()

with open("categories.json", "w") as f:
    out = json.dumps([{"category": v} for v in np_array_to_list])
    #json.dump(out, fp=f)
    f.write(out)