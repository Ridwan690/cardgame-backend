const sequelize = require("./database");

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Koneksi ke database berhasil!");
  } catch (error) {
    console.error("❌ Gagal konek ke database:", error);
  }
};

testConnection();
