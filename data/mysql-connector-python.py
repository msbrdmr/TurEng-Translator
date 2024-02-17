import mysql.connector
import json

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234",
    database="translator"
)

# Use dictionary cursor to get results as dictionaries
cursor = conn.cursor(dictionary=True)

# Specify the English word for which you want to retrieve translations
target_english_word = 'torment'

# SQL query to retrieve translations
query = """
SELECT turkish.word AS turkish_word
FROM english
JOIN translate ON english.id = translate.english_id
JOIN turkish ON translate.turkish_id = turkish.id
WHERE english.word = %s
"""

# Execute the query with parameter
cursor.execute(query, (target_english_word,))

# Fetch all results
translations = cursor.fetchall()

# Close MySQL connection
cursor.close()
conn.close()

# Convert the result to JSON and save to a file
output_file = 'translations.json'
with open(output_file, 'w') as file:
    json.dump(translations, file, indent=2)

print(f'Data exported to {output_file}')
