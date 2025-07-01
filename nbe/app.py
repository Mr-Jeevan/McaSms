from flask import Flask, request, jsonify
from flask_cors import CORS
from db_utils import execute_query, DB_CONFIG  # Import DB utility and config

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes, allowing your React frontend to access it


# --- Helper function to convert column names to snake_case for consistency (optional but good practice) ---
def to_snake_case(name):
    """Converts a string to snake_case."""
    import re
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower().replace(' ', '_').replace('.', '').replace('-',
                                                                                                        '_').replace(
        '(', '').replace(')', '').replace('/', '_').replace('\\n', '_')


# --- API Endpoints ---

@app.route('/')
def home():
    """Basic home route to confirm API is running."""
    return jsonify({"message": "Student Management API is running!"})


@app.route('/students', methods=['GET'])
def get_all_students():
    """Fetches all student records."""
    query = "SELECT * FROM students"
    success, result = execute_query(query, fetch_results=True)
    if success:
        return jsonify(result), 200
    return jsonify({"error": result}), 500


@app.route('/students/<int:student_id>', methods=['GET'])
def get_student_by_id(student_id):
    """Fetches a single student record by ID."""
    query = "SELECT * FROM students WHERE ID = %s"
    success, result = execute_query(query, (student_id,), fetch_results=True)
    if success:
        if result:
            return jsonify(result[0]), 200  # Return the first (and only) student found
        return jsonify({"message": "Student not found"}), 404
    return jsonify({"error": result}), 500


@app.route('/students', methods=['POST'])
def add_student():
    """Adds a new student record."""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Dynamically build query based on provided data
    columns = []
    values_placeholders = []
    params = []

    # Map frontend field names to MySQL column names (snake_case conversion)
    # This is a critical step to handle the column names with spaces/special chars
    # Ensure this mapping is robust or that frontend sends exact column names as in DB
    # For now, I'll use the exact names as in your CREATE TABLE statement

    # List of all expected columns from your CREATE TABLE statement, in order
    # Exclude `ID` as it's AUTO_INCREMENT
    expected_columns = [
        '`Application No.`', '`Register Number`', '`Name`', '`Student Contact No.`',
        '`Date of Birth`', 'Date of Joining (from 12/07/2024)', '`Gender (Male/ Female)`',
        '`Blood Group`', '`Nationality`', '`Religion`', '`Community`', '`Caste`',
        '`Boarding Status (Hostel / Day Scholar)`', '`Father Name`', '`Father Number`',
        '`Mother Name`', '`Mother Number`', '`Guardian Name`', '`Relationship`',
        '`Parent\'s Phone No.`', '`Door No. & Street`', '`Town/ Village`', '`Post`',
        '`Taluk`', '`District`', '`State`', '`Pincode`', '`Country`',
        '`Email Id (College)`', '`Email Id (Personal)`', '`SSLC - Marks (%)`',
        '`HSC - Marks (%)`', '`UG-BCA/ B.Sc. (CS/IT)`', '`Passed Out Year`',
        '`UG - Marks (%)`', '`Alumni (SRM Student-UG)`', '`College Name`',
        '`University/ Autonomous(Uni.)/ Govt. College`', '`College Place`',
        '`College State`', '`Extra Curricular Activities (Participate/ Member)`',
        '`Licence Number`', '`Passport Number`', '`Aadhaar Number`'
    ]

    # Populate columns and params based on the data received from frontend
    # It's crucial that frontend sends keys matching these exact column names (including backticks if needed)
    # Or implement a robust mapping/validation layer here.
    for col_name in expected_columns:
        # Remove backticks for dictionary key lookup
        clean_col_name = col_name.strip('`').replace('\\n ', ' ').replace('\\n', ' ').replace(' (from 12/07/2024)',
                                                                                              '')  # Adjust to match JSON keys

        # Special handling for `Date of Joining (from 12/07/2024)` and `Boarding Status\n (Hostel / Day Scholar)`
        if clean_col_name == 'Date of Joining':
            # Use the exact key from the JSON data if it was 'Date of Joining (from 12/07/2024)'
            # Or adjust your frontend to send a cleaner key.
            # For now, let's assume the frontend sends 'Date of Joining (from 12/07/2024)'
            frontend_key = 'Date of Joining (from 12/07/2024)'
        elif clean_col_name == 'Boarding Status (Hostel / Day Scholar)':
            frontend_key = 'Boarding Status\\n (Hostel / Day Scholar)'
        else:
            frontend_key = clean_col_name  # Assume direct match for others

        # If the key exists in the incoming data, add it to the query
        if frontend_key in data:
            columns.append(col_name)
            values_placeholders.append('%s')
            params.append(data[frontend_key])
        else:
            # Handle missing optional fields, e.g., set to NULL or default
            # For simplicity, if a column is not provided, we'll skip it for now.
            # In a real app, you'd define which columns are required.
            pass

    if not columns:
        return jsonify({"error": "No valid student data provided for insertion"}), 400

    query = f"INSERT INTO students ({', '.join(columns)}) VALUES ({', '.join(values_placeholders)})"

    success, result = execute_query(query, tuple(params))
    if success:
        return jsonify({"message": "Student added successfully", "details": result}), 201
    return jsonify({"error": result}), 500


@app.route('/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    """Updates an existing student record."""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided for update"}), 400

    set_clauses = []
    params = []

    # Iterate through the incoming data to build the SET clause
    for key, value in data.items():
        # Sanitize key to prevent SQL injection for column names (critical!)
        # For this example, we'll assume keys are safe or pre-validated.
        # In production, map keys to a whitelist of allowed column names.

        # Need to handle column names with spaces/special chars by enclosing in backticks
        mysql_column_name = f"`{key}`"

        # Special handling for specific column names from your CREATE TABLE
        if key == 'Date of Joining (from 12/07/2024)':
            mysql_column_name = '`Date of Joining (from 12/07/2024)`'
        elif key == 'Gender (Male/ Female)':
            mysql_column_name = '`Gender (Male/ Female)`'
        elif key == 'Boarding Status\n (Hostel / Day Scholar)':
            mysql_column_name = '`Boarding Status (Hostel / Day Scholar)`'  # Note: MySQL doesn't handle \n in column names well, use space
        elif key == 'Parent\'s Phone No.':
            mysql_column_name = '`Parent\'s Phone No.`'
        elif key == 'SSLC - Marks (%)':
            mysql_column_name = '`SSLC - Marks (%)`'
        elif key == 'HSC - Marks (%)':
            mysql_column_name = '`HSC - Marks (%)`'
        elif key == 'UG-BCA/ B.Sc. (CS/IT)':
            mysql_column_name = '`UG-BCA/ B.Sc. (CS/IT)`'
        elif key == 'UG - Marks (%)':
            mysql_column_name = '`UG - Marks (%)`'
        elif key == 'Alumni (SRM Student-UG)':
            mysql_column_name = '`Alumni (SRM Student-UG)`'
        elif key == 'College Name':
            mysql_column_name = '`College Name`'
        elif key == 'University/ Autonomous(Uni.)/ Govt. College':
            mysql_column_name = '`University/ Autonomous(Uni.)/ Govt. College`'
        elif key == 'College Place':
            mysql_column_name = '`College Place`'
        elif key == 'College State':
            mysql_column_name = '`College State`'
        elif key == 'Extra Curricular Activities (Participate/ Member)':
            mysql_column_name = '`Extra Curricular Activities (Participate/ Member)`'
        elif key == 'Licence Number':
            mysql_column_name = '`Licence Number`'
        elif key == 'Passport Number':
            mysql_column_name = '`Passport Number`'
        elif key == 'Aadhaar Number':
            mysql_column_name = '`Aadhaar Number`'
        elif key == 'Application No.':
            mysql_column_name = '`Application No.`'
        elif key == 'Register Number':
            mysql_column_name = '`Register Number`'
        elif key == 'Student Contact No.':
            mysql_column_name = '`Student Contact No.`'
        elif key == 'Date of Birth':
            mysql_column_name = '`Date of Birth`'
        elif key == 'Door No. & Street':
            mysql_column_name = '`Door No. & Street`'
        elif key == 'Town/ Village':
            mysql_column_name = '`Town/ Village`'
        elif key == 'Email Id (College)':
            mysql_column_name = '`Email Id (College)`'
        elif key == 'Email Id (Personal)':
            mysql_column_name = '`Email Id (Personal)`'
        elif key == 'Passed Out Year':
            mysql_column_name = '`Passed Out Year`'
        elif key == 'sno':  # Primary key, usually not updated this way
            continue  # Skip updating sno directly

        set_clauses.append(f"{mysql_column_name} = %s")
        params.append(value)

    if not set_clauses:
        return jsonify({"error": "No valid fields to update"}), 400

    query = f"UPDATE students SET {', '.join(set_clauses)} WHERE ID = %s"
    params.append(student_id)  # Add student_id to the end of params

    success, result = execute_query(query, tuple(params))
    if success:
        return jsonify({"message": "Student updated successfully", "details": result}), 200
    return jsonify({"error": result}), 500


@app.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    """Deletes a student record by ID."""
    query = "DELETE FROM students WHERE ID = %s"
    success, result = execute_query(query, (student_id,))
    if success:
        return jsonify({"message": "Student deleted successfully", "details": result}), 200
    return jsonify({"error": result}), 500


@app.route('/alter-column', methods=['POST'])
def alter_column():
    """
    *** EXTREMELY DANGEROUS FOR PRODUCTION ***
    Allows altering columns (e.g., dropping) based on frontend request.
    This is for demonstration ONLY and has significant security risks.
    """
    data = request.json
    if not data or 'action' not in data or 'column_name' not in data:
        return jsonify({"error": "Invalid request. 'action' and 'column_name' are required."}), 400

    action = data['action'].lower()
    column_name = data['column_name']

    # --- Security: Whitelist allowed column names for ALTER operations ---
    # This is a minimal safeguard. In a real app, you'd have very strict
    # control over what schema changes are allowed via an API.
    allowed_columns_to_alter = [
        '`Date of Joining (from 12/07/2024)`',
        '`Gender (Male/ Female)`',
        '`Blood Group`',
        '`Nationality`',
        '`Religion`',
        '`Community`',
        '`Caste`',
        '`Boarding Status (Hostel / Day Scholar)`',
        '`Father Name`',
        '`Father Number`',
        '`Mother Name`',
        '`Mother Number`',
        '`Guardian Name`',
        '`Relationship`',
        '`Parent\'s Phone No.`',
        '`Door No. & Street`',
        '`Town/ Village`',
        '`Post`',
        '`Taluk`',
        '`District`',
        '`State`',
        '`Pincode`',
        '`Country`',
        '`Email Id (College)`',
        '`Email Id (Personal)`',
        '`SSLC - Marks (%)`',
        '`HSC - Marks (%)`',
        '`UG-BCA/ B.Sc. (CS/IT)`',
        '`Passed Out Year`',
        '`UG - Marks (%)`',
        '`Alumni (SRM Student-UG)`',
        '`College Name`',
        '`University/ Autonomous(Uni.)/ Govt. College`',
        '`College Place`',
        '`College State`',
        '`Extra Curricular Activities (Participate/ Member)`',
        '`Licence Number`',
        '`Passport Number`',
        '`Aadhaar Number`'
    ]

    # Ensure the column name from the frontend matches one of the exact names in your CREATE TABLE
    # This is crucial for security and correctness.
    # The frontend should send the column name exactly as it appears in the SQL, including backticks if used.
    if column_name not in allowed_columns_to_alter:
        return jsonify({"error": f"Column '{column_name}' is not allowed for alteration or does not exist."}), 400

    query = ""
    if action == 'delete':
        query = f"ALTER TABLE students DROP COLUMN {column_name}"
    elif action == 'add':
        # Example for adding a column: needs 'column_type' in data
        if 'column_type' not in data:
            return jsonify({"error": "For 'add' action, 'column_type' is required."}), 400
        column_type = data['column_type']
        query = f"ALTER TABLE students ADD COLUMN {column_name} {column_type}"
    elif action == 'modify':
        # Example for modifying a column: needs 'new_type' in data
        if 'new_type' not in data:
            return jsonify({"error": "For 'modify' action, 'new_type' is required."}), 400
        new_type = data['new_type']
        query = f"ALTER TABLE students MODIFY COLUMN {column_name} {new_type}"
    else:
        return jsonify({"error": "Invalid alteration action. Supported: 'delete', 'add', 'modify'."}), 400

    success, result = execute_query(query)
    if success:
        return jsonify(
            {"message": f"Column '{column_name}' altered successfully with action '{action}'.", "details": result}), 200
    return jsonify({"error": result}), 500


if __name__ == '__main__':
    # You can specify the host and port here.
    # host='0.0.0.0' makes it accessible from other devices on your network.
    # debug=True enables auto-reloading and helpful error messages (disable in production).
    app.run(debug=True, host='127.0.0.1', port=5000)