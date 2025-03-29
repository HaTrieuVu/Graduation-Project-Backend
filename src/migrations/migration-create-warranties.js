"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("warranties", {
            PK_iPhieuBaoHanhID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iDonMuaHangID: {
                type: Sequelize.INTEGER,
            },
            FK_iPhienBanID: {
                type: Sequelize.INTEGER,
            },
            dNgayLap: Sequelize.DATE,
            dNgayKetThucBaoHanh: Sequelize.DATE,
            sTrangThaiXuLy: Sequelize.STRING,
            sMota: Sequelize.STRING,
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
        await queryInterface.dropTable("");
    },
};
