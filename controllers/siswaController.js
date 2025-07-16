const { Siswa, Leaderboard } = require("../models");
const { Op } = require("sequelize"); // Tambahkan import Op

const getSiswa = async (req, res) => {
  try {
    const siswaList = await Siswa.findAll({
      order: [["createdAt", "DESC"]], // Urutkan berdasarkan yang terbaru
    });
    res.json(siswaList);
  } catch (error) {
    console.error("Error fetching siswa:", error);
    res.status(500).json({ message: "Gagal memuat data siswa" });
  }
};

const createSiswa = async (req, res) => {
  const { username, nis, kelas } = req.body;

  try {
    // Validasi input
    if (!username || !nis || !kelas) {
      return res.status(400).json({
        message: "Semua field (username, nis, kelas) wajib diisi",
      });
    }

    // Trim whitespace
    const trimmedNama = username.trim();
    const trimmedNis = nis.trim();
    const trimmedKelas = kelas.trim();

    // Validasi panjang input
    if (trimmedNama.length < 2) {
      return res.status(400).json({
        message: "Nama harus minimal 2 karakter",
      });
    }

    if (trimmedNis.length < 3) {
      return res.status(400).json({
        message: "NIS harus minimal 3 karakter",
      });
    }

    // Cek apakah NIS sudah ada
    const existingNis = await Siswa.findOne({
      where: { nis: trimmedNis },
    });

    if (existingNis) {
      return res.status(409).json({
        message: "NIS sudah terdaftar, gunakan NIS yang berbeda",
      });
    }

    // Buat siswa baru
    const newSiswa = await Siswa.create({
      username: trimmedNama,
      nis: trimmedNis,
      kelas: trimmedKelas,
    });

    res.status(201).json({
      message: "Data siswa berhasil ditambahkan",
      data: newSiswa,
    });
  } catch (error) {
    console.error("Error creating siswa:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: error.errors.map((err) => err.message),
      });
    }

    // Handle Sequelize unique constraint errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Data sudah ada, gunakan data yang berbeda",
      });
    }

    res.status(500).json({ message: "Gagal menambahkan data siswa" });
  }
};

const updateSiswa = async (req, res) => {
  const { id } = req.params;
  const { username, nis, kelas } = req.body;

  try {
    // Validasi input
    if (!username || !nis || !kelas) {
      return res.status(400).json({
        message: "Semua field (username, nis, kelas) wajib diisi",
      });
    }

    // Trim whitespace
    const trimmedNama = username.trim();
    const trimmedNis = nis.trim();
    const trimmedKelas = kelas.trim();

    // Validasi panjang input
    if (trimmedNama.length < 2) {
      return res.status(400).json({
        message: "Nama harus minimal 2 karakter",
      });
    }

    if (trimmedNis.length < 3) {
      return res.status(400).json({
        message: "NIS harus minimal 3 karakter",
      });
    }

    // Cari siswa yang akan diupdate
    const siswa = await Siswa.findByPk(id);
    if (!siswa) {
      return res.status(404).json({
        message: "Data siswa tidak ditemukan",
      });
    }

    // Cek apakah NIS sudah ada (kecuali untuk siswa yang sedang diupdate)
    const existingNis = await Siswa.findOne({
      where: {
        nis: trimmedNis,
        id_siswa: { [Op.ne]: id }, // Tidak sama dengan ID yang sedang diupdate
      },
    });

    if (existingNis) {
      return res.status(409).json({
        message: "NIS sudah terdaftar, gunakan NIS yang berbeda",
      });
    }

    // Update siswa
    await siswa.update({
      username: trimmedNama,
      nis: trimmedNis,
      kelas: trimmedKelas,
    });

    res.json({
      message: "Data siswa berhasil diperbarui",
      data: siswa,
    });
  } catch (error) {
    console.error("Error updating siswa:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data tidak valid",
        errors: error.errors.map((err) => err.message),
      });
    }

    // Handle Sequelize unique constraint errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Data sudah ada, gunakan data yang berbeda",
      });
    }

    res.status(500).json({ message: "Gagal memperbarui data siswa" });
  }
};

const deleteSiswa = async (req, res) => {
  const { id } = req.params;

  try {
    // Cari siswa yang akan dihapus
    const siswa = await Siswa.findByPk(id);
    if (!siswa) {
      return res.status(404).json({
        message: "Data siswa tidak ditemukan",
      });
    }

    // Cek apakah siswa sedang digunakan di leaderboard
    const usedInLeaderboard = await Leaderboard.findOne({
      where: { id_siswa: id },
    });

    if (usedInLeaderboard) {
      return res.status(409).json({
        message:
          "Tidak dapat menghapus siswa yang memiliki riwayat permainan di leaderboard",
      });
    }

    // Hapus siswa
    await siswa.destroy();

    res.json({
      message: "Data siswa berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting siswa:", error);
    res.status(500).json({ message: "Gagal menghapus data siswa" });
  }
};

const getSiswaById = async (req, res) => {
  const { id } = req.params;

  try {
    const siswa = await Siswa.findByPk(id);
    if (!siswa) {
      return res.status(404).json({
        message: "Data siswa tidak ditemukan",
      });
    }

    res.json(siswa);
  } catch (error) {
    console.error("Error fetching siswa by ID:", error);
    res.status(500).json({ message: "Gagal memuat data siswa" });
  }
};

const searchSiswa = async (req, res) => {
  const { query } = req.query;

  try {
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        message: "Query pencarian harus minimal 2 karakter",
      });
    }

    const trimmedQuery = query.trim();

    const siswaList = await Siswa.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${trimmedQuery}%` } }, // Case-insensitive
          { nis: { [Op.iLike]: `%${trimmedQuery}%` } }, // Case-insensitive
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(siswaList);
  } catch (error) {
    console.error("Error searching siswa:", error);
    res.status(500).json({ message: "Gagal mencari data siswa" });
  }
};

module.exports = {
  createSiswa,
  getSiswa,
  updateSiswa,
  deleteSiswa,
  getSiswaById,
  searchSiswa,
};
