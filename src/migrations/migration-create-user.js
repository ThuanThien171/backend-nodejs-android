'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            account: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            fullName: {
                type: Sequelize.STRING,
            },
            role: {
                type: Sequelize.STRING,
            },
            gender: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            phoneNumber: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    },
};
