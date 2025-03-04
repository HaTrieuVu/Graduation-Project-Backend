"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("product_reviews", {
            PK_iDanhGiaID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iChiTietDonHangID: {
                type: Sequelize.INTEGER,
            },
            FK_iKhachHangID: {
                type: Sequelize.INTEGER,
            },
            FK_iSanPhamID: {
                type: Sequelize.INTEGER,
            },
            fSoSaoDanhGia: Sequelize.FLOAT,
            sNoiDungDanhGia: Sequelize.TEXT,
            dNgayDanhGia: Sequelize.DATE,
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
        await queryInterface.dropTable("product_reviews");
    },
};
