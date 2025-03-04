"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            Role.hasMany(models.Employee, { foreignKey: "FK_iQuyenHanID", as: "employees" }); //done
            Role.hasMany(models.Customer, { foreignKey: "FK_iQuyenHanID", as: "customers" }); //done
        }
    }
    Role.init(
        {
            PK_iQuyenHanID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            sTenQuyenHan: DataTypes.STRING,
            sMoTa: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Role",
        }
    );
    return Role;
};
