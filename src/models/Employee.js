"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Employee extends Model {
        static associate(models) {
            Employee.hasMany(models.Order, { foreignKey: "FK_iNhanVienID", as: "orders" }); //done
            Employee.hasMany(models.ImportReceipt, { foreignKey: "FK_iNhanVienID", as: "importReceipts" }); //done
            Employee.belongsTo(models.Role, { foreignKey: "FK_iQuyenHanID", as: "role" }); //done
        }
    }

    Employee.init(
        {
            PK_iNhanVienID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            FK_iQuyenHanID: DataTypes.INTEGER,
            sHoTen: DataTypes.STRING,
            sEmail: DataTypes.STRING,
            sSoDienThoai: DataTypes.STRING,
            sDiaChi: DataTypes.STRING,
            sTenDangNhap: DataTypes.STRING,
            sMatKhau: DataTypes.STRING,
            bTrangThaiTaiKhoan: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "Employee",
        }
    );

    return Employee;
};
