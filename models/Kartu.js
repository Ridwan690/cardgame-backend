const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Kartu = sequelize.define("Kartu", {
  id_kartu: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  kata: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

module.exports = Kartu;
