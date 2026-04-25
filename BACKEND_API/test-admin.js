const axios = require('axios');

async function run() {
    try {
        console.log("Logging in...");
        const loginRes = await axios.post('http://localhost:5000/api/admin/login', {
            email: 'meherlokanath314@gmail.com', // from .env
            password: 'Biswa12345'
        });
        
        const token = loginRes.data.token;
        console.log("Token:", token.substring(0, 20) + "...");
        
        console.log("Fetching users...");
        const usersRes = await axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Users fetched successfully:", usersRes.data.count);
        
        console.log("Fetching subscriptions...");
        const subsRes = await axios.get('http://localhost:5000/api/subscriptions/admin', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Subscriptions fetched successfully:", subsRes.data.count);
        
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

run();
