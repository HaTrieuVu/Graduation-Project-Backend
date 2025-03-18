"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("order_details", {
            PK_iChiTietDonHangID: {
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
            iSoLuong: Sequelize.INTEGER,
            fGiaBan: Sequelize.FLOAT,
            fThanhTien: Sequelize.FLOAT,
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
        await queryInterface.dropTable("order_details");
    },
};
