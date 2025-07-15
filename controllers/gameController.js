// controllers/GameController.js
const { Level, Kartu, Leaderboard, Siswa, Permainan } = require("../models");

const getGameData = async (req, res) => {
  const { levelId } = req.params;
  try {
    const level = await Level.findByPk(parseInt(levelId));
    if (!level) {
      return res.status(404).json({ message: "Level tidak ditemukan" });
    }

    const allCards = await Kartu.findAll();
    const shuffled = allCards.sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, level.card_count);

    const gameCards = selectedCards
      .flatMap((card) => [
        {
          uid: Math.random().toString(36).substr(2, 9),
          id_kartu: card.id_kartu,
          type: "text",
          kata: card.kata,
          image_url: null,
        },
        {
          uid: Math.random().toString(36).substr(2, 9),
          id_kartu: card.id_kartu,
          type: "image",
          kata: null,
          image_url: card.image_url,
        },
      ])
      .sort(() => 0.5 - Math.random());

    res.json({
      time_limit: level.time_limit,
      cards: gameCards,
    });
  } catch (error) {
    console.error("getGameData error:", error);
    res.status(500).json({ message: error.message });
  }
};

const submitScore = async (req, res) => {

  const { id_siswa, level_id, score, duration } = req.body;

  // Validasi input
  if (!id_siswa || !level_id || score === undefined) {
    return res.status(400).json({
      message: "id_siswa, level_id, dan score wajib diisi",
    });
  }

  // Validasi duration
  if (
    duration !== undefined &&
    (typeof duration !== "number" || duration < 0)
  ) {
    return res.status(400).json({
      message: "Duration harus berupa angka positif",
    });
  }

  try {
    // Validasi siswa dan level exist
    const siswa = await Siswa.findByPk(id_siswa);
    if (!siswa) {
      return res.status(404).json({ message: "Siswa tidak ditemukan" });
    }

    const level = await Level.findByPk(level_id);
    if (!level) {
      return res.status(404).json({ message: "Level tidak ditemukan" });
    }

    // Simpan ke tabel permainan
    const permainan = await Permainan.create({
      id_siswa,
      id_level: level_id,
      score,
      play_date: new Date(),
    });

    // Simpan ke leaderboard 
    const leaderboard = await Leaderboard.create({
      id_siswa,
      id_level: level_id, 
      score,
      duration: duration || 0, // PERBAIKAN: Tambahkan duration dengan default 0
    });

    res.status(201).json({
      message: "Skor berhasil disimpan",
      data: {
        permainan,
        leaderboard,
      },
    });
  } catch (error) {
    console.error("submitScore error:", error);
    res.status(500).json({
      message: "Gagal menyimpan skor",
      error: error.message,
    });
  }
};

module.exports = {
  getGameData,
  submitScore,
};
