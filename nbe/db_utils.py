import mysql.connector
from mysql.connector import errorcode

# --- Database Configuration ---
# IMPORTANT: Replace with your actual MySQL database details.
# For production, use environment variables (e.g., os.getenv('DB_USER'))
DB_CONFIG = {
    'user': 'root',         # Your MySQL username
    'password': 'root', # Your MySQL password
    'host': '127.0.0.1',    # The IP address of your MySQL server (localhost)
    'database': 'student_management_db', # The name of your database
    'port': 3306            # The port number (default is 3306)
}

def get_db_connection():
    """
    Establishes a connection to the MySQL database.
    Returns the connection object or None if connection fails.
    """
    try:
        cnx = mysql.connector.connect(**DB_CONFIG)
        return cnx
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Error: Something is wrong with your user name or password.")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Error: Database does not exist.")
        else:
            print(f"Error connecting to database: {err}")
        return None

def execute_query(query, params=None, fetch_results=False):
    """
    Executes a SQL query and optionally fetches results.
    Returns fetched results for SELECT queries, or True/False for DML/DDL.
    """
    cnx = None
    cursor = None
    try:
        cnx = get_db_connection()
        if cnx is None:
            return False, "Database connection failed."

        cursor = cnx.cursor(dictionary=True) # Use dictionary=True to get results as dictionaries
        cursor.execute(query, params)

        if fetch_results:
            results = cursor.fetchall()
            return True, results
        else:
            cnx.commit() # Commit changes for INSERT, UPDATE, DELETE, ALTER
            return True, "Query executed successfully."

    except mysql.connector.Error as err:
        print(f"SQL Error: {err}")
        if cnx:
            cnx.rollback() # Rollback changes on error
        return False, f"SQL Error: {err}"
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        if cnx:
            cnx.rollback()
        return False, f"Unexpected error: {e}"
    finally:
        if cursor:
            cursor.close()
        if cnx and cnx.is_connected():
            cnx.close()