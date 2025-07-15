// sync-models.js
require("dotenv").config();

// Import models dan sequelize
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

async function syncAllModels() {
  try {
    console.log("🔄 Starting database sync...");

    // Test koneksi
    await sequelize.authenticate();
    console.log("✅ Database connection successful!");

    // Debug: Tampilkan model yang ter-load
    console.log("📋 Checking loaded models:");
    console.log("   - Admin:", !!Admin);
    console.log("   - Siswa:", !!Siswa);
    console.log("   - Kosakata:", !!Kosakata);
    console.log("   - Kartu:", !!Kartu);
    console.log("   - Level:", !!Level);
    console.log("   - Permainan:", !!Permainan);
    console.log("   - Leaderboard:", !!Leaderboard);

    // Cek jika ada model yang undefined
    const models = {
      Admin,
      Siswa,
      Kosakata,
      Kartu,
      Level,
      Permainan,
      Leaderboard,
    };
    const undefinedModels = Object.keys(models).filter((key) => !models[key]);

    if (undefinedModels.length > 0) {
      console.error("❌ The following models are undefined:", undefinedModels);
      return;
    }

    // Cek force mode
    const forceMode = process.argv.includes("--force");

    if (forceMode) {
      console.log(
        "⚠️  WARNING: Force mode enabled - This will DROP all tables!"
      );
      console.log("⚠️  All data will be lost!");

      await sequelize.sync({ force: true });
      console.log("✅ Force sync completed!");
    } else {
      console.log("🔄 Syncing tables in correct order...");

      // Sync tabel independen dulu (tanpa foreign key)
      console.log("📝 Creating independent tables...");
      await Admin.sync({ alter: true });
      console.log("   ✅ Admin table synced");

      await Siswa.sync({ alter: true });
      console.log("   ✅ Siswa table synced");

      await Kartu.sync({ alter: true });
      console.log("   ✅ Kartu table synced");

      // Sync tabel yang bergantung pada tabel di atas
      console.log("📝 Creating dependent tables...");
      await Level.sync({ alter: true });
      console.log("   ✅ Level table synced");

      await Kosakata.sync({ alter: true });
      console.log("   ✅ Kosakata table synced");

      await Permainan.sync({ alter: true });
      console.log("   ✅ Permainan table synced");

      await Leaderboard.sync({ alter: true });
      console.log("   ✅ Leaderboard table synced");

      // Sync junction tables untuk many-to-many relationships
      console.log("📝 Creating junction tables...");
      await sequelize.sync({ alter: true });
      console.log("   ✅ Junction tables synced");

      console.log("✅ Sequential sync completed!");
    }

    console.log("✅ All models synced successfully!");

    // Tampilkan tabel yang dibuat
    console.log("📊 Database tables:");
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();
    tables.forEach((table) => {
      console.log(`   - ${table}`);
    });

    // Buat admin default jika belum ada
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      console.log("👤 Creating default admin...");
      await Admin.create({
        username: "admin",
        password: "admin123", // Ganti dengan password yang di-hash
      });
      console.log("✅ Default admin created!");
    }

    console.log("🎉 Database sync completed successfully!");
  } catch (error) {
    console.error("❌ Error syncing models:", error.message);
    console.error("❌ Stack trace:", error.stack);

    // Specific error handling
    if (error.name === "SequelizeConnectionError") {
      console.log("🔍 Check your database connection settings in .env");
    } else if (error.name === "SequelizeAccessDeniedError") {
      console.log("🔍 Check your database username/password");
    } else if (error.name === "SequelizeDatabaseError") {
      console.log("🔍 Database error details:");
      console.log("   - Message:", error.original?.message);
      console.log("   - Code:", error.original?.code);
      console.log("   - Detail:", error.original?.detail);

      if (error.original?.message?.includes("does not exist")) {
        console.log(
          "💡 Suggestion: Try running with --force flag to recreate all tables"
        );
      }
    } else if (error.name === "SequelizeForeignKeyConstraintError") {
      console.log("🔍 Foreign key constraint error");
      console.log(
        "💡 Suggestion: Try running with --force flag to recreate all tables"
      );
    }
  } finally {
    await sequelize.close();
    console.log("🔐 Database connection closed.");
  }
}

// Jalankan sync
console.log("🚀 Starting sync process...");
syncAllModels();
