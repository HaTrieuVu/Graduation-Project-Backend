"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("import_receipt_details", {
            PK_iChiTietPhieuNhapID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iPhieuNhapID: {
                type: Sequelize.INTEGER,
            },
            FK_iSanPhamID: {
                type: Sequelize.INTEGER,
            },
            iSoLuongNhap: Sequelize.INTEGER,
            fGiaNhap: Sequelize.FLOAT,
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
        await queryInterface.dropTable("import_receipt_details");
    },
};
