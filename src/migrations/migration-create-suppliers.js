"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("suppliers", {
            PK_iNhaCungCapID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            sTenNhaCungCap: Sequelize.STRING,
            sDiaChi: Sequelize.STRING,
            sSoDienThoai: Sequelize.STRING,
            sEmail: Sequelize.STRING,
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
        await queryInterface.dropTable("suppliers");
    },
};
