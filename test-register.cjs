const axios = require('axios');

async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:3001/api/register', {
      user_name: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Registration successful:', response.data);
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
}

testRegistration();
