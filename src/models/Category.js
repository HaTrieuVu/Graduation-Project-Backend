"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.hasMany(models.Product, { foreignKey: "FK_iDanhMucID", as: "products" }); //done
        }
    }
    Category.init(
        {
            PK_iDanhMucID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            sTenDanhMuc: DataTypes.STRING,
            sMoTa: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Category",
        }
    );
    return Category;
};
