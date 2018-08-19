# -*- coding: utf-8 -*-
"""
Created on Sat Aug 18 18:43:17 2018

@author: andre
"""

import pandas as pd
import json
from random import randint

def isInt(s):
    try: 
        int(s)
        return True
    except ValueError:
        return False
    
def toInt(s):
    return int(s) if isInt(s) else pd.np.inf


dt = pd.read_csv("catalog_export.csv", encoding="latin")

dt_needed = dt[['Activity_ID', 'ActivityName', 'OtherCategoryName', \
                'FeeSummary', 'AgesMin', 'AgesMax', 'EnrollMax', \
                'NumberEnrolled', 'BeginningDate', 'StartingTime',
                'EndingDate', 'EndingTime', 'Description', 'CategoryName']]

def fee(s):
    if s == "Free":
        return "$0"
    else:
        l = str(s).split(':')
        return l[-1]

f = lambda x : x if isInt(x) else pd.np.inf
ages = lambda x, y: str(x) + (" to " + str(y) if str(y) != "0" else " and above")
dateTime = lambda x, y: x + " " + y

def ranImg(s):
    randomint = randint(1, 5)
    return f'./img/img{randomint}.jpeg'


a = dt_needed['EnrollMax'].apply(f)
b = dt_needed['NumberEnrolled'].apply(f)

dt_needed['EventID'] = dt_needed['Activity_ID']
dt_needed['EventName'] = dt_needed['ActivityName']
dt_needed['EventCommName'] = dt_needed['OtherCategoryName']
dt_needed['EventPricePerPerson'] = dt_needed['FeeSummary'].apply(fee)
dt_needed['EventAges'] = pd.np.vectorize(ages)(dt_needed['AgesMin'], dt_needed['AgesMax'])
dt_needed['EventSpaces'] = pd.to_numeric(a) - pd.to_numeric(b)
dt_needed['EventDateTimeStart'] = pd.np.vectorize(dateTime)(dt_needed['BeginningDate'], dt_needed['StartingTime'])
dt_needed['EventDateTimeEnd'] = pd.np.vectorize(dateTime)(dt_needed['EndingDate'], dt_needed['EndingTime'])
dt_needed['EventDescription'] = dt_needed['Description']
dt_needed['EventCategory'] = dt_needed['CategoryName']
dt_needed['img'] = dt_needed['CategoryName'].apply(ranImg)


eventDT = dt_needed[['EventID', 'EventName', 'EventCommName', 
                     'EventPricePerPerson', 'EventAges', 'EventSpaces', 
                     'EventDateTimeStart', 'EventDateTimeEnd', 
                     'EventDescription', 'EventCategory','img']]

with open("envents.json", "w") as f:
    out = eventDT.to_json(orient='records')
    #json.dump(out, fp=f)
    f.write(out)