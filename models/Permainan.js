const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Permainan = sequelize.define("Permainan", {
  id_permainan: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  play_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  id_siswa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Siswas',
      key: 'id_siswa'
    }
  },
  id_level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Levels',
      key: 'id_level'
    }
  },
});

module.exports = Permainan;
