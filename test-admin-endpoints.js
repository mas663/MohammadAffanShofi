const baseUrl = "http://localhost:3001";

const endpoints = [
  "/api/admin/hero",
  "/api/admin/about",
  "/api/admin/skills",
  "/api/admin/projects",
  "/api/admin/certifications",
];

async function testEndpoint(url) {
  try {
    const response = await fetch(url);
    const status = response.status;

    if (status === 401) {
      return { url, status: "401 Unauthorized (expected - no session)" };
    } else if (status === 200) {
      return { url, status: "200 OK (should be 401!)" };
    } else if (status === 500) {
      const text = await response.text();
      return { url, status: `500 ERROR`, error: text };
    } else {
      return { url, status: `${status} ${response.statusText}` };
    }
  } catch (error) {
    return { url, status: "FETCH ERROR", error: error.message };
  }
}

async function testAll() {
  console.log("\n=== Testing Admin Endpoints ===\n");

  for (const endpoint of endpoints) {
    const url = `${baseUrl}${endpoint}`;
    const result = await testEndpoint(url);

    console.log(`${endpoint}`);
    console.log(`  Status: ${result.status}`);
    if (result.error) {
      console.log(`  Error: ${result.error.substring(0, 200)}`);
    }
    console.log("");
  }
}

testAll();
