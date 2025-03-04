"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("feedbacks", {
            PK_iPhanHoiID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iKhachHangID: Sequelize.INTEGER,
            sNoiDungPhanHoi: Sequelize.STRING,
            dThoiGianGui: Sequelize.DATE,
            sTrangThaiXuLy: Sequelize.STRING,
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
        await queryInterface.dropTable("feedbacks");
    },
};
