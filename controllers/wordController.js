const { Kosakata, Kartu } = require("../models");
const supabase = require("../config/supabase");
const { v4: uuidv4 } = require("uuid");

// Mendapatkan URL publik dari Supabase
function getPublicUrl(filename) {
  const { data } = supabase.storage.from("uploads").getPublicUrl(filename);
  return data?.publicUrl;
}

const getAllWords = async (req, res) => {
  try {
    const words = await Kosakata.findAll({
      include: {
        model: Kartu,
        as: "kartu",
      },
    });
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addWord = async (req, res) => {
  try {
    const { kata } = req.body;

    let image_url = null;

    if (req.file) {
      const fileExt = req.file.originalname.split(".").pop();
      const filename = `${uuidv4()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("uploads")
        .upload(filename, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (error) {
        return res
          .status(500)
          .json({ message: "Upload gagal", error: error.message });
      }

      image_url = getPublicUrl(filename);
    }

    const newCard = await Kartu.create({ kata, image_url });
    const newWord = await Kosakata.create({ id_kartu: newCard.id_kartu });

    res.status(201).json({ message: "Kosakata berhasil ditambahkan", newWord });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWord = async (req, res) => {
  try {
    const { id } = req.params;
    const { kata } = req.body;

    const kosakata = await Kosakata.findByPk(id);
    if (!kosakata) {
      return res.status(404).json({ message: "Kosakata tidak ditemukan" });
    }

    const kartu = await Kartu.findByPk(kosakata.id_kartu);
    if (kartu) {
      kartu.kata = kata;

      if (req.file) {
        // Hapus gambar lama dari Supabase
        if (kartu.image_url) {
          const parts = kartu.image_url.split("/");
          const filename = parts[parts.length - 1];
          await supabase.storage.from("uploads").remove([filename]);
        }

        // Upload gambar baru
        const fileExt = req.file.originalname.split(".").pop();
        const filename = `${uuidv4()}.${fileExt}`;

        const { error } = await supabase.storage
          .from("uploads")
          .upload(filename, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });

        if (error) {
          return res
            .status(500)
            .json({ message: "Upload gagal", error: error.message });
        }

        kartu.image_url = getPublicUrl(filename);
      }

      await kartu.save();
    }

    res.json({ message: "Kosakata berhasil diperbarui" });
  } catch (error) {
    console.error("Error updateWord:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteWord = async (req, res) => {
  try {
    const { id } = req.params;

    const kosakata = await Kosakata.findByPk(id);
    if (!kosakata)
      return res.status(404).json({ message: "Kosakata tidak ditemukan" });

    const kartu = await Kartu.findByPk(kosakata.id_kartu);
    if (kartu && kartu.image_url) {
      const parts = kartu.image_url.split("/");
      const filename = parts[parts.length - 1];

      await supabase.storage.from("uploads").remove([filename]);
      await kartu.destroy();
    }

    await kosakata.destroy();
    res.json({ message: "Kosakata berhasil dihapus" });
  } catch (error) {
    console.error("Error saat menghapus kosakata:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllWords,
  addWord,
  updateWord,
  deleteWord,
};
