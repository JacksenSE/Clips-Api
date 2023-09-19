'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('videos', 'data', {
      type: Sequelize.BLOB, // Use the appropriate data type for your database
      allowNull: true,      // Adjust this as needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('videos', 'data');
  },
};
