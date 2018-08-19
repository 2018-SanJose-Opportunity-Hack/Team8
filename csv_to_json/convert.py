import csv
Category = set()
with open('/Users/khantil/Developer/hacakthons/Team8/csv_to_json/catalog_export.csv') as csvfile:
         spamreader = csv.reader(csvfile, delimiter=',')
         count = 0
         for row in spamreader:
             print(type(row))
            #  if count == 2:
            #      break
        #  for row in spamreader:
        #      print(type(row))
        #      Category.add(row[0])

# DataFile='/Users/khantil/Developer/hacakthons/Team8/csv_to_json/catalog_export.csv'
# DataCaptured = csv.reader(DataFile, delimiter=',', skipinitialspace=True) 

# Category = set()
# for row in DataCaptured:
#     print(f'{row[0]}')
#     Category.add(row[2])    

# print (f'{Category}')