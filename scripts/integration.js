import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const API = process.env.VITE_API_URL || "http://127.0.0.1:8000";

async function run() {
  const ts = Date.now();
  const email = `ci_upload_${ts}@example.com`;
  const password = "CiUploadPass123";

  try {
    console.log("Health check...");
    const h = await axios.get(`${API}/health`);
    console.log("health", h.data);
  } catch (e) {
    console.error("Health check failed", e.message);
    process.exit(1);
  }

  try {
    console.log("Registering user", email);
    const reg = await axios.post(`${API}/api/auth/register`, {
      email,
      username: `ci_user_${ts}`,
      full_name: "CI Test",
      password,
    });
    console.log("registered", reg.status);
  } catch (e) {
    if (e.response) console.error("register failed", e.response.data);
    else console.error("register failed", e.message);
    process.exit(1);
  }

  let token;
  try {
    const login = await axios.post(`${API}/api/auth/login`, {
      email,
      password,
    });
    token = login.data.access_token;
    console.log("login success");
  } catch (e) {
    console.error("login failed", e.response?.data || e.message);
    process.exit(1);
  }

  try {
    const filePath = "./backend/sample_files/sample.pdf";
    const fd = new FormData();
    fd.append("file", fs.createReadStream(filePath));

    console.log("Uploading sample file...");
    const upload = await axios.post(`${API}/api/resume/upload`, fd, {
      headers: Object.assign(
        { Authorization: `Bearer ${token}` },
        fd.getHeaders(),
      ),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    console.log("upload status", upload.status, upload.data.id || upload.data);
  } catch (e) {
    console.error("upload failed", e.response?.data || e.message);
    process.exit(1);
  }

  console.log("Integration test passed");
}

run();
