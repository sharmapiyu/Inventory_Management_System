// API endpoints
const API_URL = '/api/employees';

// DOM Elements
const employeeForm = document.getElementById('employeeForm');
const employeeList = document.getElementById('employeeList');
const searchInput = document.getElementById('searchInput');

// Load employees when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();
});

// Form submit handler
employeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const employeeId = document.getElementById('employeeId').value;
    const employee = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    try {
        if (employeeId) {
            // Update existing employee
            await fetch(`${API_URL}/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employee)
            });
        } else {
            // Create new employee
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employee)
            });
        }
        
        resetForm();
        loadEmployees();
        showNotification('Employee saved successfully!', 'success');
    } catch (error) {
        showNotification('Error saving employee', 'error');
        console.error('Error:', error);
    }
});

// Load employees from API
async function loadEmployees() {
    try {
        const response = await fetch(API_URL);
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        showNotification('Error loading employees', 'error');
        console.error('Error:', error);
    }
}

// Display employees in table
function displayEmployees(employees) {
    employeeList.innerHTML = '';
    
    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editEmployee(${employee.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" onclick="deleteEmployee(${employee.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        employeeList.appendChild(row);
    });
}

// Edit employee
async function editEmployee(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const employee = await response.json();
        
        document.getElementById('employeeId').value = employee.id;
        document.getElementById('name').value = employee.name;
        document.getElementById('email').value = employee.email;
        document.getElementById('phone').value = employee.phone;
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showNotification('Error loading employee details', 'error');
        console.error('Error:', error);
    }
}

// Delete employee
async function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            loadEmployees();
            showNotification('Employee deleted successfully!', 'success');
        } catch (error) {
            showNotification('Error deleting employee', 'error');
            console.error('Error:', error);
        }
    }
}

// Reset form
function resetForm() {
    employeeForm.reset();
    document.getElementById('employeeId').value = '';
}

// Search functionality
searchInput.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = employeeList.getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 