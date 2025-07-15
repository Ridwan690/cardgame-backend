const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Siswa = sequelize.define("Siswa", {
  id_siswa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  kelas: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nis: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Siswa;
