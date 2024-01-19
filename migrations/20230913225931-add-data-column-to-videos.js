'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('videos', 'data', {
      type: Sequelize.BLOB, 
      allowNull: true,      
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('videos', 'data');
  },
};