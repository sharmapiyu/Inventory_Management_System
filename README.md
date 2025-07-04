 Employee Management System (Spring Boot)
A simple CRUD-based Employee Management System built with Spring Boot, Spring MVC, and Spring Data JPA. This project allows users to perform basic employee operations like creating, reading, updating, and deleting employee records using a web-based interface.

🚀 Features
📝 Add new employee

👀 View all employees

✏️ Update employee information

❌ Delete employee

🌐 Web-based interface with basic navigation

🔗 JDBC configuration with entity-repository mapping

🛠️ Tech Stack
Backend: Java 17, Spring Boot, Spring MVC, Spring Data JPA

Database: H2 / MySQL (can be configured)

View: JSP + JSTL (Java Server Pages)

Build Tool: Maven

IDE: Visual Studio Code (workspace: JDBC.code-workspace)

📁 Project Structure
arduino
Copy
Edit
src/
├── controller/
│   ├── EmpController.java
│   └── HomeController.java
├── entity/
│   └── EmployeeEntity.java
├── model/
│   └── Employee.java
├── repository/
│   └── EmployeeRepository.java
├── service/
│   └── EmployeeServiceImpl.java
├── config/
│   └── WebConfig.java
├── EmProjectApplication.java
🔧 How to Run
Clone the repository

bash
Copy
Edit
git clone https://github.com/your-username/employee-management-springboot.git
cd employee-management-springboot
Import project in your favorite IDE (e.g., IntelliJ IDEA, VS Code with Java extensions).

Set up database

Default is H2 (in-memory)

You can configure MySQL in application.properties

Run the application

bash
Copy
Edit
mvn spring-boot:run
Access the app

arduino
Copy
Edit
http://localhost:8080/
🧪 API Endpoints
Method	URL	Description
GET	/	Home Page
GET	/empform	Show Add Form
POST	/save	Save New Employee
GET	/viewemp	List All Employees
GET	/editemp/{id}	Edit Employee
POST	/editsave	Save Edited Employee
GET	/deleteemp/{id}	Delete Employee
