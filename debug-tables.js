// debug-tables.js
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

async function debugTables() {
  try {
    console.log("🔍 Debugging table information...");

    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Check existing tables
    console.log("\n📋 Checking existing tables in database:");
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();

    if (tables.length === 0) {
      console.log("   ❌ No tables found in database");
    } else {
      tables.forEach((table) => {
        console.log(`   - ${table}`);
      });
    }

    // Check model configurations
    console.log("\n🔧 Checking model configurations:");

    const models = {
      Admin,
      Siswa,
      Kosakata,
      Kartu,
      Level,
      Permainan,
      Leaderboard,
    };

    for (const [modelName, model] of Object.entries(models)) {
      console.log(`\n   ${modelName}:`);
      console.log(`     - Model name: ${model.name}`);
      console.log(`     - Table name: ${model.tableName}`);
      console.log(`     - Raw table name: ${model.getTableName()}`);

      // Check if table exists for this model
      const tableExists = tables.includes(model.getTableName());
      console.log(`     - Table exists: ${tableExists}`);

      if (!tableExists) {
        console.log(
          `     ❌ Table ${model.getTableName()} not found in database!`
        );
      }
    }

    // Check foreign key references
    console.log("\n🔗 Checking foreign key references:");

    console.log("\n   Permainan model references:");
    const permainanAttrs = Permainan.getAttributes();
    Object.keys(permainanAttrs).forEach((attr) => {
      const attribute = permainanAttrs[attr];
      if (attribute.references) {
        console.log(
          `     - ${attr} -> ${attribute.references.model}.${attribute.references.key}`
        );
      }
    });

    console.log("\n   Leaderboard model references:");
    const leaderboardAttrs = Leaderboard.getAttributes();
    Object.keys(leaderboardAttrs).forEach((attr) => {
      const attribute = leaderboardAttrs[attr];
      if (attribute.references) {
        console.log(
          `     - ${attr} -> ${attribute.references.model}.${attribute.references.key}`
        );
      }
    });

    // Try to create Siswa table manually
    console.log("\n🔨 Attempting to create Siswa table manually...");
    try {
      await Siswa.sync({ force: true });
      console.log("✅ Siswa table created successfully");

      // Check if table now exists
      const updatedTables = await queryInterface.showAllTables();
      const siswaTableExists = updatedTables.find(
        (t) => t.toLowerCase().includes("siswa") || t.includes("Siswa")
      );
      console.log(`   - Siswa table found: ${siswaTableExists || "NOT FOUND"}`);
    } catch (error) {
      console.error("❌ Error creating Siswa table:", error.message);
    }

    // Try to describe Siswa table
    console.log("\n📝 Describing Siswa table structure...");
    try {
      const siswaDescription = await queryInterface.describeTable("Siswa");
      console.log("✅ Siswa table structure:");
      Object.keys(siswaDescription).forEach((column) => {
        console.log(`   - ${column}: ${siswaDescription[column].type}`);
      });
    } catch (error) {
      console.error("❌ Cannot describe Siswa table:", error.message);

      // Try with lowercase
      try {
        const siswaDescription = await queryInterface.describeTable("siswa");
        console.log("✅ siswa table structure (lowercase):");
        Object.keys(siswaDescription).forEach((column) => {
          console.log(`   - ${column}: ${siswaDescription[column].type}`);
        });
      } catch (lowerError) {
        console.error(
          "❌ Cannot describe siswa table (lowercase):",
          lowerError.message
        );
      }
    }
  } catch (error) {
    console.error("❌ Debug error:", error.message);
    console.error("Stack:", error.stack);
  } finally {
    await sequelize.close();
    console.log("\n🔐 Database connection closed");
  }
}

debugTables();
