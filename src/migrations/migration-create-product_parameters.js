"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("product_parameters", {
            PK_iThongSoID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iSanPhamID: {
                type: Sequelize.INTEGER,
            },
            sHeDieuHanh: Sequelize.STRING,
            sCPU: Sequelize.STRING,
            sTocDoCPU: Sequelize.STRING,
            sGPU: Sequelize.STRING,
            sRAM: Sequelize.STRING,
            sCameraSau: Sequelize.STRING,
            sCameraTruoc: Sequelize.STRING,
            sManHinh: Sequelize.STRING,
            sPin: Sequelize.STRING,
            sLoaiPin: Sequelize.STRING,
            sSac: Sequelize.STRING,

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
        await queryInterface.dropTable("product_parameters");
    },
};
