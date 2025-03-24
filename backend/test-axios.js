const axios = require("axios");

async function testAPI() {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8001/process-resume?file_url=http://localhost:8000/resumes/1736060755414.pdf"
    );
    console.log("Success:", res.data);
  } catch (error) {
    console.error("Failed:", error.response?.data || error.message);
  }
}

testAPI();
