// Test file for code suggestions feature
// This file intentionally contains code quality issues for testing

function processUserData(data) {
    // Magic number - should be a constant
    if (data.age > 18) {
        console.log("User is an adult");
    }
    
    // Long function - should be split
    let result = "";
    for (let i = 0; i < data.items.length; i++) {
        result += data.items[i].name + ", ";
        result += data.items[i].price + ", ";
        result += data.items[i].quantity + ", ";
        // ... imagine 40 more lines here
    }
    
    // No error handling
    const response = fetch("https://api.example.com/users/" + data.id);
    
    // Hardcoded credentials - security issue
    const apiKey = "sk_test_1234567890abcdef";
    
    // No input validation
    return eval(data.expression);
}

// Duplicate code
function processAdminData(data) {
    if (data.age > 18) {
        console.log("Admin is an adult");
    }
    
    let result = "";
    for (let i = 0; i < data.items.length; i++) {
        result += data.items[i].name + ", ";
        result += data.items[i].price + ", ";
    }
    
    return result;
}

// Poor naming
function x(a, b) {
    return a + b;
}

// Missing documentation
class UserManager {
    constructor() {
        this.users = [];
    }
    
    addUser(user) {
        this.users.push(user);
    }
}

// Made with Bob
