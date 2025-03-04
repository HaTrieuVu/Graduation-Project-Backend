"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("import_receipts", {
            PK_iPhieuNhapID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iNhanVienID: {
                type: Sequelize.INTEGER,
            },
            FK_iNhaCungCapID: {
                type: Sequelize.INTEGER,
            },
            dNgayLap: Sequelize.DATE,
            sGhiChu: Sequelize.STRING,
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
        await queryInterface.dropTable("import_receipts");
    },
};
