// models/index.js
const sequelize = require("../config/database");

// Import semua model
const Admin = require("./Admin");
const Siswa = require("./Siswa");
const Kosakata = require("./Kosakata");
const Kartu = require("./Kartu");
const Level = require("./Level");
const Permainan = require("./Permainan");
const Leaderboard = require("./Leaderboard");

// Admin Relations
Admin.hasMany(Kosakata, { foreignKey: "id_admin" });
Kosakata.belongsTo(Admin, { foreignKey: "id_admin" });

Admin.hasMany(Level, { foreignKey: "id_admin" });
Level.belongsTo(Admin, { foreignKey: "id_admin" });

Admin.hasMany(Leaderboard, { foreignKey: "id_admin" });
Leaderboard.belongsTo(Admin, { foreignKey: "id_admin" });

//  Siswa Relations
Siswa.hasMany(Permainan, {
  foreignKey: "id_siswa",
  as: "SiswaPermainan",
});
Permainan.belongsTo(Siswa, {
  foreignKey: "id_siswa",
  as: "siswa",
});

// Siswa -> Leaderboard (One-to-One, dengan alias)
Siswa.hasOne(Leaderboard, {
  foreignKey: "id_siswa",
  as: "LeaderboardSiswa",
});

Leaderboard.belongsTo(Siswa, {
  foreignKey: "id_siswa",
  as: "LeaderboardSiswa",
});

// Level -> Leaderboard (Many-to-One, satu level bisa banyak leaderboard)
Level.hasMany(Leaderboard, {
  foreignKey: "id_level",
  as: "leaderboards", // optional alias
});

Leaderboard.belongsTo(Level, {
  foreignKey: "id_level",
  as: "level",
});

// Permainan <-> Kosakata (Many-to-Many)
Permainan.belongsToMany(Kosakata, {
  through: "PermainanKosakata",
  foreignKey: "id_permainan",
});
Kosakata.belongsToMany(Permainan, {
  through: "PermainanKosakata",
  foreignKey: "id_kata",
});

//  Permainan <-> Level
Level.hasMany(Permainan, { foreignKey: "id_level" });
Permainan.belongsTo(Level, { foreignKey: "id_level", as: "level" });

//  Kosakata <-> Kartu (One-to-One)
Kartu.hasOne(Kosakata, { foreignKey: "id_kartu" });
Kosakata.belongsTo(Kartu, { foreignKey: "id_kartu", as: "kartu" });

// Export Semua Model DAN sequelize instance
module.exports = {
  Admin,
  Siswa,
  Kosakata,
  Kartu,
  Level,
  Permainan,
  Leaderboard,
  sequelize, // ← INI YANG PENTING!
};
