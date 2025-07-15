"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Permainans", "id_siswa", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Siswas", // Sesuaikan dengan nama tabel siswa kamu
        key: "id_siswa",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addColumn("Permainans", "id_level", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Levels", // Sesuaikan dengan nama tabel level kamu
        key: "id_level",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Permainans", "id_siswa");
    await queryInterface.removeColumn("Permainans", "id_level");
  },
};
