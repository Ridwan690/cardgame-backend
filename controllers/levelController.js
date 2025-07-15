const { Level, Leaderboard } = require("../models");

const getLevels = async (req, res) => {
  try {
    const levels = await Level.findAll({
      order: [["id_level", "ASC"]], 
    });
    res.json(levels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching levels" });
  }
};

const createLevel = async (req, res) => {
  const { nama_level, time_limit, card_count } = req.body;
  try {
    const newLevel = await Level.create({ nama_level,time_limit, card_count  });
    res.status(201).json(newLevel);
  } catch (error) {
    console.error("Error creating level:", error);
    res.status(500).json({ message: "Error creating level" });
  }
};

const updateLevel = async (req, res) => {
  const { id } = req.params;
  const { nama_level,time_limit, card_count  } = req.body;

  try {
    const level = await Level.findByPk(id);
    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }

    level.nama_level = nama_level !== undefined ? nama_level : level.nama_level;
    level.time_limit = time_limit !== undefined ? time_limit : level.time_limit;
    level.card_count = card_count !== undefined ? card_count : level.card_count;


    await level.save();

    res.json(level);
  } catch (error) {
    res.status(500).json({ message: "Error updating level" });
  }
};

const deleteLevel = async (req, res) => {
  const { id } = req.params;

  try {
    const level = await Level.findByPk(id);
    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }

    // Hapus semua leaderboard yang terkait level ini
    await Leaderboard.destroy({ where: { id_level: id } });

    await level.destroy();
    res.status(200).json({ message: "Level berhasil dihapus" });
  } catch (error) {
    console.error("Error deleteLevel:", error);
    res.status(500).json({ message: "Error deleting level" });
  }
};


module.exports = { getLevels, createLevel, updateLevel, deleteLevel };
