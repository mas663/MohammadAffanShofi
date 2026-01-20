const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateImages() {
  const uploadsDir = path.join(__dirname, "public", "uploads");

  console.log("📁 Reading uploads directory...");
  const files = fs.readdirSync(uploadsDir);

  console.log(`📋 Found ${files.length} files to migrate\n`);

  let successCount = 0;
  let errorCount = 0;
  const urlMapping = {};

  for (const file of files) {
    try {
      const filePath = path.join(uploadsDir, file);
      const fileBuffer = fs.readFileSync(filePath);

      console.log(`⬆️  Uploading: ${file}`);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("portfolio")
        .upload(file, fileBuffer, {
          contentType: getContentType(file),
          upsert: true,
        });

      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
        errorCount++;
        continue;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("portfolio").getPublicUrl(data.path);

      urlMapping[`/uploads/${file}`] = publicUrl;

      console.log(`   ✅ Success: ${publicUrl}\n`);
      successCount++;
    } catch (err) {
      console.error(`   ❌ Error uploading ${file}:`, err.message, "\n");
      errorCount++;
    }
  }

  console.log("\n═══════════════════════════════════════");
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log("═══════════════════════════════════════\n");

  // Update database URLs
  console.log("🔄 Updating database URLs...");
  await updateDatabaseUrls(urlMapping);

  console.log("\n✨ Migration complete!");
  console.log(
    "\n💡 Next steps:\n   1. Verify images at: https://supabase.com/dashboard/project/[your-project]/storage/buckets/portfolio",
  );
  console.log("   2. Test admin panel upload");
  console.log("   3. Deploy to Vercel\n");
}

async function updateDatabaseUrls(urlMapping) {
  const tables = ["certifications", "education", "projects"];

  for (const table of tables) {
    console.log(`\n📊 Updating ${table} table...`);

    // Get all records
    const { data: records, error: fetchError } = await supabase
      .from(table)
      .select("*");

    if (fetchError) {
      console.error(`   ❌ Error fetching ${table}:`, fetchError.message);
      continue;
    }

    // Update each record that has image_url
    for (const record of records) {
      if (record.image_url && record.image_url.startsWith("/uploads/")) {
        const newUrl = urlMapping[record.image_url];

        if (newUrl) {
          const { error: updateError } = await supabase
            .from(table)
            .update({ image_url: newUrl })
            .eq("id", record.id);

          if (updateError) {
            console.error(
              `   ❌ Error updating ${table} ID ${record.id}:`,
              updateError.message,
            );
          } else {
            console.log(`   ✅ Updated ${table} ID ${record.id}`);
          }
        }
      }
    }
  }
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  return types[ext] || "application/octet-stream";
}

// Run migration
migrateImages().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
