"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("product_images", {
            PK_iHinhAnhID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iPhienBanID: {
                type: Sequelize.INTEGER,
            },
            sUrl: Sequelize.BLOB("long"),
            sMoTa: Sequelize.TEXT,
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
        await queryInterface.dropTable("product_images");
    },
};
