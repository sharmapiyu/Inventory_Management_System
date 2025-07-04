/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.example.em_project;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    @Autowired
     private EmployeeRepository employeeRepository;
    //List<Employee>  employees = new ArrayList<>();

    @Override
    public String createEmployee(Employee employee) {
        EmployeeEntity employeeEntity =new EmployeeEntity();
        BeanUtils.copyProperties(employee, employeeEntity);
        employeeRepository.save(employeeEntity); 
        //employees.add(employee);
        return "saved successfully";

       
    }

    @Override
    public List<Employee> readEmployees() {
        List<EmployeeEntity>employeesList = employeeRepository.findAll();
        List<Employee>  employees = new ArrayList<>();
        for (EmployeeEntity employeeEntity : employeesList) {
            Employee emp = new Employee();
            emp.setId(employeeEntity.getId());
            emp.setName(employeeEntity.getName());
            emp.setEmail(employeeEntity.getEmail());
            emp.setPhone(employeeEntity.getPhone());

            employees.add(emp);

            
        }
        return employees;
        
    }

    @Override
    public boolean deleteEmployee( Long id){
    EmployeeEntity emp = employeeRepository.findById(id).get();
            employeeRepository.delete(emp);
            return  true;
        
    }

    @Override
    public String updateEmployee(Long id, Employee employee) {
        EmployeeEntity exestingEmployee = employeeRepository.findById(id).get();
        exestingEmployee.setEmail(employee.getEmail());
        exestingEmployee.setName(employee.getName());
        exestingEmployee.setPhone(employee.getPhone());
        employeeRepository.save(exestingEmployee);
        return "update successfully";
    }

    @Override
    public Employee readEmployee(Long id) {
         EmployeeEntity employeeEntity = employeeRepository.findById(id).get();
          Employee employee = new Employee();
        BeanUtils.copyProperties(employeeEntity,employee);
        return employee;
       
    }

}
