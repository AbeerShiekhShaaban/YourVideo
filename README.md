### YourVideo

### 1- Install nodeJS v18.12.1 on your computer.

### 2- Install MongoDB 6.0.3 on your computer (you can use this url:

### https://www.mongodb.com/docs/manual/administration/install-community/

### 3- Create folder with name "data" in the c:/ drive , then inside the "data" folder create another folder with name "db".

### 4- Navigate to the "db" folder using the command line, then type this line in command line to run MongoDB in the back while using server: "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="c:\data\db"

### for more help you can visit: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/

### 5- To make sure that the MongoDB is running, you have to see ("Waiting for connections","attr":{"port":27017,"ssl":"off"}} ) in the command line.

### 6- Use the command line to navigate to the "back" folder, then write npm install to install the dependencies, then run nodemon server to start the server on http://localhost:4000/

### 7- Use the command line to navigate to the "front-react" folder, then write npm install to install the dependencies, then write npm start to start React on http://localhost:3000/
