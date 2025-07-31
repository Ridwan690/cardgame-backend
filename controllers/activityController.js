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

// TAMBAH ENDPOINT BARU INI
const getActivitiesBySiswa = async (req, res) => {
  try {
    const { siswaId } = req.query;

    // Validasi parameter
    if (!siswaId) {
      return res.status(400).json({
        message: "Parameter siswaId diperlukan",
      });
    }

    console.log(`Fetching activities for siswa ID: ${siswaId}`);

    const activities = await Permainan.findAll({
      where: {
        id_siswa: siswaId, // Filter berdasarkan ID siswa
      },
      include: [
        { model: Siswa, as: "siswa", attributes: ["username"] },
        { model: Level, as: "level", attributes: ["nama_level"] },
      ],
      order: [["play_date", "DESC"]],
    });

    console.log(`Found ${activities.length} activities for siswa ${siswaId}`);

    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities by siswa:", error);
    res.status(500).json({
      message: "Gagal mengambil data aktivitas siswa",
    });
  }
};

const resetActivities = async (req, res) => {
  try {
    await Permainan.destroy({
      where: {}, // Hapus semua data
    });

    res.json({
      message: "Data kegiatan berhasil dihapus (ID tetap lanjut)",
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
  getActivitiesBySiswa, // Export endpoint baru
  resetActivities, // Export endpoint hapus by siswa
};
