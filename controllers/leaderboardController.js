const { Leaderboard, Siswa, Level } = require("../models");

// GET all leaderboard entries (with siswa & level info)
const getLeaderboard = async (req, res) => {
  try {
    const data = await Leaderboard.findAll({
      include: [
        {
          model: Siswa,
          as: "LeaderboardSiswa",
        },
        {
          model: Level,
          as: "level",
        },
      ],
      order: [
        ["score", "DESC"], // Primary: Score tertinggi
        ["duration", "ASC"], // Secondary: Waktu tercepat (duration terkecil)
      ],
    });
    res.json(data);
  } catch (err) {
    console.error("Error getting leaderboard:", err); // TAMBAHAN: Log error untuk debugging
    res.status(500).json({
      message: "Gagal mengambil data leaderboard",
      error: err.message,
    });
  }
};

// CREATE leaderboard entry
const createLeaderboard = async (req, res) => {
  const { id_siswa, level_id, score, duration } = req.body;

  if (!id_siswa || !level_id || score === undefined) {
    return res.status(400).json({
      message: "id_siswa, level_id, dan score wajib diisi.",
    });
  }

  // Validasi untuk duration
  if (
    duration !== undefined &&
    (typeof duration !== "number" || duration < 0)
  ) {
    return res.status(400).json({
      message: "Duration harus berupa angka positif.",
    });
  }

  try {
    const newEntry = await Leaderboard.create({
      id_siswa,
      level_id,
      score,
      duration: duration || 0, // Default 0 jika tidak ada duration
    });

    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Error creating leaderboard:", error); // TAMBAHAN: Log error
    res.status(500).json({
      message: "Gagal membuat entri leaderboard",
      error: error.message,
    });
  }
};

// UPDATE leaderboard entry
const updateLeaderboard = async (req, res) => {
  const { id } = req.params;
  const { id_siswa, level_id, score, duration } = req.body;

  try {
    const entry = await Leaderboard.findByPk(id);
    if (!entry) {
      return res
        .status(404)
        .json({ message: "Entri leaderboard tidak ditemukan" });
    }

    //  Ganti 'leaderboard' dengan 'entry'
    entry.id_siswa = id_siswa || entry.id_siswa;
    entry.level_id = level_id || entry.level_id;
    entry.score = score ?? entry.score;
    entry.duration = duration ?? entry.duration; 

    await entry.save();
    res.json(entry);
  } catch (error) {
    console.error("Error updating leaderboard:", error); // Log error
    res
      .status(500)
      .json({ message: "Gagal mengupdate leaderboard", error: error.message });
  }
};

// DELETE leaderboard entry
const deleteLeaderboard = async (req, res) => {
  const { id } = req.params;

  try {
    const entry = await Leaderboard.findByPk(id);
    if (!entry) {
      return res
        .status(404)
        .json({ message: "Entri leaderboard tidak ditemukan" });
    }

    await entry.destroy();
    res.json({ message: "Entri leaderboard berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting leaderboard:", error); // Log error
    res
      .status(500)
      .json({ message: "Gagal menghapus leaderboard", error: error.message });
  }
};

// RESET leaderboard
const resetLeaderboard = async (req, res) => {
  try {
    await Leaderboard.destroy({ where: {} });
    res.json({ message: "Leaderboard berhasil direset" });
  } catch (error) {
    console.error("Error resetting leaderboard:", error); // Log error
    res
      .status(500)
      .json({ message: "Gagal mereset leaderboard", error: error.message });
  }
};

module.exports = {
  getLeaderboard,
  createLeaderboard,
  updateLeaderboard,
  deleteLeaderboard,
  resetLeaderboard,
};
