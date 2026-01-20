const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function testBucket() {
  console.log("🔍 Checking buckets...\n");

  // List all buckets
  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();

  if (listError) {
    console.error("❌ Error listing buckets:", listError);
    return;
  }

  console.log("📦 Available buckets:");
  buckets.forEach((bucket) => {
    console.log(`   - ${bucket.id} (${bucket.public ? "PUBLIC" : "PRIVATE"})`);
  });

  // Try to upload a test file
  console.log("\n🧪 Testing upload to 'portfolio' bucket...");
  const testBuffer = Buffer.from("test content");

  const { data, error } = await supabase.storage
    .from("portfolio")
    .upload("test.txt", testBuffer, {
      contentType: "text/plain",
      upsert: true,
    });

  if (error) {
    console.error("❌ Upload error:", error);
  } else {
    console.log("✅ Upload successful!");
    console.log("   Path:", data.path);

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("portfolio").getPublicUrl(data.path);
    console.log("   URL:", publicUrl);

    // Clean up test file
    await supabase.storage.from("portfolio").remove(["test.txt"]);
    console.log("   (Test file removed)");
  }
}

testBucket().catch(console.error);
