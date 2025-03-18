"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("notifications", {
            PK_iThongBaoID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iKhachHangID: Sequelize.INTEGER,
            FK_iDonMuaHangID: Sequelize.INTEGER,
            sNoiDung: Sequelize.STRING,
            dThoiGianGui: Sequelize.DATE,
            sTrangThaiDoc: Sequelize.STRING,
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
        await queryInterface.dropTable("notifications");
    },
};
