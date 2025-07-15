// quick-fix-sync.js
require("dotenv").config();

const {
  Admin,
  Siswa,
  Kosakata,
  Kartu,
  Level,
  Permainan,
  Leaderboard,
  sequelize,
} = require("./models/index");

async function quickFixSync() {
  try {
    console.log("🔧 Quick fix sync...");

    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Cek foreign key references yang bermasalah
    console.log("\n🔍 Checking foreign key references:");

    const permainanAttrs = Permainan.getAttributes();
    console.log("Permainan foreign keys:");
    Object.keys(permainanAttrs).forEach((attr) => {
      const attribute = permainanAttrs[attr];
      if (attribute.references) {
        console.log(
          `   - ${attr} -> ${attribute.references.model}.${attribute.references.key}`
        );
      }
    });

    // Coba buat tabel Permainan dengan referensi yang benar
    console.log("\n🔨 Creating Permainan table...");
    try {
      await Permainan.sync({ force: true });
      console.log("✅ Permainan table created successfully");
    } catch (error) {
      console.error("❌ Error creating Permainan table:", error.message);

      // Jika gagal, coba dengan approach yang berbeda
      console.log("\n🔄 Trying alternative approach...");

      // Drop foreign key constraints temporarily
      await sequelize.query(`
        DO $$ 
        BEGIN 
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Permainans') THEN
            DROP TABLE "Permainans" CASCADE;
          END IF;
        END $$;
      `);

      // Recreate with proper references
      await Permainan.sync({ force: true });
      console.log("✅ Permainan table created with alternative approach");
    }

    // Coba buat tabel Leaderboard
    console.log("\n🔨 Creating Leaderboard table...");
    try {
      await Leaderboard.sync({ force: true });
      console.log("✅ Leaderboard table created successfully");
    } catch (error) {
      console.error("❌ Error creating Leaderboard table:", error.message);

      // Alternative approach for Leaderboard
      await sequelize.query(`
        DO $$ 
        BEGIN 
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Leaderboards') THEN
            DROP TABLE "Leaderboards" CASCADE;
          END IF;
        END $$;
      `);

      await Leaderboard.sync({ force: true });
      console.log("✅ Leaderboard table created with alternative approach");
    }

    // Sync junction tables
    console.log("\n🔗 Creating junction tables...");
    await sequelize.sync({ alter: true });
    console.log("✅ Junction tables created");

    // Verify all tables exist
    console.log("\n📋 Final verification:");
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();

    const expectedTables = [
      "Admins",
      "Siswas",
      "Kartus",
      "Levels",
      "Kosakata",
      "Permainans",
      "Leaderboards",
    ];

    expectedTables.forEach((table) => {
      const exists = tables.includes(table);
      console.log(`   ${exists ? "✅" : "❌"} ${table}`);
    });

    // Check junction tables
    const junctionTables = tables.filter(
      (t) => t.includes("Permainan") && t.includes("Kosakata")
    );
    if (junctionTables.length > 0) {
      console.log(`   ✅ Junction table: ${junctionTables[0]}`);
    }

    console.log("\n🎉 Quick fix completed!");
  } catch (error) {
    console.error("❌ Quick fix error:", error.message);
    console.error("Stack:", error.stack);
  } finally {
    await sequelize.close();
    console.log("\n🔐 Database connection closed");
  }
}

quickFixSync();
