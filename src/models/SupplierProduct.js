"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class SupplierProduct extends Model {
        static associate(models) {
            SupplierProduct.belongsTo(models.Supplier, { foreignKey: "FK_iNhaCungCapID", as: "supplier" }); //done
            SupplierProduct.belongsTo(models.Product, { foreignKey: "FK_iSanPhamID", as: "product" }); //done
        }
    }

    SupplierProduct.init(
        {
            PK_iNhaCungCapSanPhamID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iNhaCungCapID: { type: DataTypes.INTEGER, allowNull: false },
            FK_iSanPhamID: { type: DataTypes.INTEGER, allowNull: false },
        },
        { sequelize, modelName: "SupplierProduct", tableName: "supplier_products" }
    );
    return SupplierProduct;
};
