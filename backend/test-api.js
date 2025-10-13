const axios = require('axios');

/**
 * Simple health check script to ensure the backend API is running correctly
 */
async function runTests() {
  const baseURL = process.env.API_URL || 'http://localhost:5000';
  console.log(`Testing API at ${baseURL}...`);
  
  try {
    // Test 1: Health Check
    console.log('\n🧪 TEST 1: Health Check');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check successful:', healthResponse.data);
    
    // Test 2: Get Courses
    console.log('\n🧪 TEST 2: Get Courses');
    const coursesResponse = await axios.get(`${baseURL}/api/courses`);
    console.log(`✅ Courses fetched successfully (${coursesResponse.data.length} courses)`);
    
    // Test 3: Attempting Login
    console.log('\n🧪 TEST 3: Login Validation');
    try {
      await axios.post(`${baseURL}/api/auth/login`, { email: 'test@example.com', password: 'wrongpassword' });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Login validation working correctly (returned 401 for invalid credentials)');
      } else {
        throw error;
      }
    }
    
    console.log('\n✨ All tests passed! The API is running correctly.');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    process.exit(1);
  }
}

runTests();