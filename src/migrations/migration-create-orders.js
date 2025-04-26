"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("orders", {
            PK_iDonMuaHangID: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            FK_iNhanVienID: {
                type: Sequelize.INTEGER,
            },
            FK_iKhachHangID: {
                type: Sequelize.INTEGER,
            },
            dNgayLapDon: Sequelize.DATE,
            fTongTien: Sequelize.FLOAT,
            fPhiShip: Sequelize.FLOAT,
            sPhuongThucThanhToan: Sequelize.STRING,
            sCongThanhToan: Sequelize.STRING,
            sTrangThaiDonHang: Sequelize.STRING,
            sTrangThaiThanhToan: Sequelize.STRING,
            sDiaChiGiaoHang: Sequelize.STRING,
            dNgayGiaoHang: Sequelize.DATE,
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
        await queryInterface.dropTable("orders");
    },
};
