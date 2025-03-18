"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("products", {
            PK_iSanPhamID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iDanhMucID: {
                type: Sequelize.INTEGER,
            },
            FK_iNhanHangID: {
                type: Sequelize.INTEGER,
            },
            sTenSanPham: Sequelize.STRING,
            sMoTa: Sequelize.TEXT,
            sDanhGia: Sequelize.FLOAT,
            sTinhTrangSanPham: Sequelize.STRING,
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
        await queryInterface.dropTable("products");
    },
};
