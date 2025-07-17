const { Permainan, Siswa, Level } = require("../models");

const getRecentActivities = async (req, res) => {
  try {
    const activities = await Permainan.findAll({
      include: [
        { model: Siswa, as: "siswa", attributes: ["username"] },
        { model: Level, as: "level", attributes: ["nama_level"] },
      ],
      order: [["play_date", "DESC"]],
      limit: 5,
    });

    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil aktivitas permainan" });
  }
};

const resetActivities = async (req, res) => {
  try {
    await sequelize.query(`TRUNCATE "Permainans" RESTART IDENTITY CASCADE`);

    res.json({
      message: "Data kegiatan berhasil direset",
      success: true,
    });
  } catch (error) {
    console.error("Error resetting activities:", error);
    res.status(500).json({
      message: "Gagal mereset data kegiatan",
      success: false,
    });
  }
};

module.exports = {
  getRecentActivities,
  resetActivities,
};
