"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ProductReview extends Model {
        static associate(models) {
            ProductReview.belongsTo(models.OrderDetail, { foreignKey: "FK_iChiTietDonHangID", as: "orderDetail" }); //done
            ProductReview.belongsTo(models.Customer, { foreignKey: "FK_iKhachHangID", as: "customer" }); //done
            ProductReview.belongsTo(models.Product, { foreignKey: "FK_iSanPhamID", as: "product" }); //done
        }
    }

    ProductReview.init(
        {
            PK_iDanhGiaID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iChiTietDonHangID: DataTypes.INTEGER,
            FK_iKhachHangID: DataTypes.INTEGER,
            FK_iSanPhamID: DataTypes.INTEGER,
            fSoSaoDanhGia: DataTypes.FLOAT,
            sNoiDungDanhGia: DataTypes.TEXT,
            dNgayDanhGia: DataTypes.DATE,
        },
        { sequelize, modelName: "ProductReview" }
    );
    return ProductReview;
};
