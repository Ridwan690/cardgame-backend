"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Leaderboards", "id_siswa", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Siswas", // Nama tabel relasi (harus sesuai dengan nama di database, biasanya plural)
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addColumn("Leaderboards", "id_level", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Levels",
        key: "id_level",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Leaderboards", "id_siswa");
    await queryInterface.removeColumn("Leaderboards", "id_level");
  },
};
