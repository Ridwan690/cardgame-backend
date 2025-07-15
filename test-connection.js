// test-connection.js
require("dotenv").config();
const sequelize = require("./config/database");

async function testConnection() {
  try {
    // Test koneksi ke database
    await sequelize.authenticate();
    console.log("✅ Connection to PostgreSQL successful!");

    // Test sync model (opsional)
    await sequelize.sync();
    console.log("✅ Database sync successful!");
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error);
  } finally {
    // Tutup koneksi
    await sequelize.close();
    console.log("🔐 Connection closed.");
  }
}

testConnection();
