#type:ignore
import mysql.connector
from flask import Flask,request,jsonify
from flask_cors import CORS

app=Flask(__name__)
CORS(app) 

try:
    mydb=mysql.connector.connect(
        host="localhost",
        user="root",
        password="Jeevan1234",
        database="Students"
    )
    if mydb:
        print("connection suceessful")
except mysql.connector.Error as e:
    print(e)

def createTable():
    try:
        mycursor=mydb.cursor()
        mycursor.execute('''
            CREATE TABLE IF NOT EXISTS Student (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                rollno VARCHAR(255),
                branch VARCHAR(255),
                section VARCHAR(255),
                hobbies VARCHAR(255),
                friends VARCHAR(255)
            )
        ''')

        mycursor.execute('SHOW TABLES')
        for i in mycursor.fetchall():
            print("table",i)
    except mysql.connector.Error as e:
        print(f"not created {e}")

@app.route('/get_student',methods=['GET'])
def get_student():
    try:
        mycursor=mydb.cursor()
        id=request.args.get('id')
        mycursor.execute(f"select * from Student where id={id}")
        x=mycursor.fetchall()

        return jsonify(x),200
    except mysql.connector.Error as e:
        print(e)

@app.route('/remove_student',methods=['DELETE'])
def delete_student():
    try:
        mycursor=mydb.cursor()
        data=request.get_json()
        id=data["id"]
        mycursor.execute(f"DELETE FROM Student WHERE id={id}")
        mydb.commit()
        
        return jsonify("deleted"),200
    except mysql.connector.Error as e:
        return str(e),500
        
@app.route('/add_student',methods=['POST'])
def add_student():
    try:
        data=request.get_json(silent=True)
        mycursor=mydb.cursor()
        values=tuple(data.values())
        columns= ','.join(data.keys())
        placeholder=','.join(['%s']*len(data))
        sql=f"INSERT INTO Student ({columns}) VALUES ({placeholder})"

        mycursor.execute(sql,values)
        mydb.commit()

        return jsonify("student added"),201
    except mysql.connector.Error as e:
        return str(e),500

@app.route('/edit_student',methods=['POST'])
def edit_student():
    try:
        data=request.get_json(silent=True)
        id=request.args.get("id")
        mycursor=mydb.cursor()
        values=tuple(data.values())
        placeholders=','.join([f"{key}=%s" for key in data.keys()])
        print("edit",data,id)

        sql = f'UPDATE Student SET {placeholders} WHERE id = {id}'
        print(sql,values)
        mycursor.execute(sql,values)
        mydb.commit()

        return jsonify("student updated"),201
    except mysql.connector.Error as e:
        return str(e),500

@app.route('/get_students',methods=['GET'])
def get_students():
    try:
        mycursor=mydb.cursor()
        mycursor.execute('select * from Student')
        x=mycursor.fetchall()
        for i in x:
            print(i)
        return jsonify(x), 200
    except mysql.connector.Error as e:
        return str(e),500

if __name__=='__main__':
    createTable()
    app.run(debug=True,port=5000)