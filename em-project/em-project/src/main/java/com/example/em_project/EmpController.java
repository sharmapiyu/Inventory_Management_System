package com.example.em_project;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EmpController {
   //dependency injection
   @Autowired
   private EmployeeService employeeService;
   

  @GetMapping("/employees")
   public ResponseEntity<List<Employee>> getAllEmployees() {
      return ResponseEntity.ok(employeeService.readEmployees()) ;
} 

  @GetMapping("/employees/{id}")
   public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
      return ResponseEntity.ok(employeeService.readEmployee(id)) ;
   }
  @PostMapping("/employees")
  public ResponseEntity<?> createEmployee(@Validated @RequestBody Employee employee) {
      try {
          String result = employeeService.createEmployee(employee);
          return ResponseEntity.ok(result);
      } catch (Exception e) {
          return ResponseEntity.badRequest().body(e.getMessage());
      }
  }
  @DeleteMapping("/employees/{id}")
  public ResponseEntity<String> deleteEmployee(@PathVariable  Long id){
   try {
       if(employeeService.deleteEmployee(id))
          return ResponseEntity.ok("Employee deleted successfully");
       return ResponseEntity.notFound().build();
   } catch (Exception e) {
       return ResponseEntity.badRequest().body(e.getMessage());
   }

  } 
  @PutMapping("/employees/{id}")
  public ResponseEntity<?> updateEmployee(@PathVariable Long id ,@Validated @RequestBody Employee employee ){
    try {
        String result = employeeService.updateEmployee(id, employee);
        return ResponseEntity.ok(result);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

    
}
