"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.Customer, { foreignKey: "FK_iKhachHangID", as: "customers" }); //done
            Cart.hasMany(models.CartDetail, { foreignKey: "FK_iGioHangID", as: "cartDetails" }); //done
        }
    }
    Cart.init(
        {
            PK_iGioHangID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iKhachHangID: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Cart",
        }
    );
    return Cart;
};
