"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Supplier extends Model {
        static associate(models) {
            Supplier.hasMany(models.ImportReceipt, { foreignKey: "FK_iNhaCungCapID", as: "importReceipts" }); //done
            Supplier.hasMany(models.SupplierProduct, { foreignKey: "FK_iNhaCungCapID", as: "supplier" }); //done
        }
    }

    Supplier.init(
        {
            PK_iNhaCungCapID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            sTenNhaCungCap: DataTypes.STRING,
            sDiaChi: DataTypes.STRING,
            sSoDienThoai: DataTypes.STRING,
            sEmail: DataTypes.STRING,
        },
        { sequelize, modelName: "Supplier" }
    );
    return Supplier;
};
