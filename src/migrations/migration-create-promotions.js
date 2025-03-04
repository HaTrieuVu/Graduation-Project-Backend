"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("promotions", {
            PK_iKhuyenMaiID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iSanPhamID: {
                type: Sequelize.INTEGER,
            },
            sMoTa: Sequelize.STRING,
            fGiaTriKhuyenMai: Sequelize.FLOAT,
            bTrangThai: Sequelize.BOOLEAN,
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
        await queryInterface.dropTable("promotions");
    },
};
