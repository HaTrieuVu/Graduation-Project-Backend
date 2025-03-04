"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("suppliers", {
            PK_iPhieuBaoHanhID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iDonMuaHangID: {
                type: Sequelize.INTEGER,
            },
            FK_iKhachHangID: {
                type: Sequelize.INTEGER,
            },
            dNgayGuiYeuCau: Sequelize.DATE,
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
