import roleService from "../services/roleService";

const getAllRole = async (req, res) => {
    try {
        let data = await roleService.getAllRoleService();

        return res.status(200).json({
            errorCode: data.errorCode,
            errorMessage: data.errorMessage,
            data: data.data,
        });
    } catch (error) {
        console.log(">>> ERR", error);
        return res.status(500).json({
            errorCode: -1,
            errorMessage: "Error From Server",
            data: "",
        });
    }
};

module.exports = {
    getAllRole,
};
