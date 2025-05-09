"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("product_versions", {
            PK_iPhienBanID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iSanPhamID: {
                type: Sequelize.INTEGER,
            },
            FK_iHinhAnhID: {
                type: Sequelize.INTEGER,
            },
            sDungLuong: Sequelize.STRING,
            sDungLuongKhaDung: Sequelize.STRING,
            fGiaBan: Sequelize.FLOAT,
            iSoLuong: Sequelize.INTEGER,
            bTrangThai: Sequelize.BOOLEAN,
            iThoiGianBaoHanh: DataTypes.INTEGER,
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
        await queryInterface.dropTable("product_versions");
    },
};
