import mysql.connector

def print_students_table():
    try:
        # Establish the database connection
        # Replace 'your_user', 'your_password', and 'your_host' with your actual MySQL credentials
        # And ensure 'student_management_db' is your database name
        cnx = mysql.connector.connect(
            host='127.0.0.1',      # e.g., 'localhost'
            user='root',      # e.g., 'root'
            password='root', # your MySQL password
            database='student_management_db'
        )

        if cnx.is_connected():
            print("MySQL Database connection successful!")
            cursor = cnx.cursor()

            # Execute the SELECT query to fetch all data from the 'students' table
            query = "SELECT * FROM students"
            cursor.execute(query)

            # Fetch all the rows
            rows = cursor.fetchall()

            # Get column names (optional, but good for clear output)
            column_names = [i[0] for i in cursor.description]
            print("\n--- Contents of 'students' table ---")

            # Print column headers
            print(f"| {' | '.join(column_names)} |")
            print(f"|{'-' * (sum(len(col) for col in column_names) + (len(column_names) - 1) * 3 + 2)}|") # Separator line

            # Print each row
            for row in rows:
                # Convert all items in the row to string for consistent printing
                # Handle potential None values by converting them to 'NULL' string
                formatted_row = [str(item) if item is not None else 'NULL' for item in row]
                print(f"| {' | '.join(formatted_row)} |")

    except mysql.connector.Error as err:
        if err.errno == mysql.connector.errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
    finally:
        if 'cnx' in locals() and cnx.is_connected():
            cursor.close()
            cnx.close()
            print("\nMySQL connection is closed.")

# Call the function to print the table
print_students_table()