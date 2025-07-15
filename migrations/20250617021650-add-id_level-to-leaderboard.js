'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Leaderboards", "id_level", {
      type: Sequelize.INTEGER,
      references: {
        model: "Levels",
        key: "id_level",
      },
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn("Leaderboards", "id_level");
  }
};
