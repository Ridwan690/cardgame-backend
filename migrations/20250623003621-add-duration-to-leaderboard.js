"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Leaderboards", "duration", {
      type: Sequelize.INTEGER,
      allowNull: false, 
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Leaderboards", "duration");
  },
};
