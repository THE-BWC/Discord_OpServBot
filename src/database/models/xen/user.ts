import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes
} from "sequelize";
import { xenDatabase } from "../../databaseConnection.js";
const sequelize = xenDatabase;

class XenUserModel extends Model<InferAttributes<XenUserModel>, InferCreationAttributes<XenUserModel>> {
    declare user_id: number
    declare username: string
    declare user_group_id: number
    declare secondary_group_ids: string
}

XenUserModel.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    user_group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    secondary_group_ids: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'xf_user',
})

export default XenUserModel;