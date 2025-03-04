"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("customers", {
            PK_iKhachHangID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iQuyenHanID: {
                type: Sequelize.INTEGER,
            },
            sHoTen: Sequelize.STRING,
            sEmail: Sequelize.STRING,
            sSoDienThoai: Sequelize.STRING,
            sDiaChi: Sequelize.STRING,
            sTenDangNhap: Sequelize.STRING,
            sMatKhau: Sequelize.STRING,
            sAvatar: Sequelize.BLOB("long"),
            bTrangThaiTaiKhoan: Sequelize.BOOLEAN,
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
        await queryInterface.dropTable("customers");
    },
};
