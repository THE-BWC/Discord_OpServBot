import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes
} from "sequelize";
import { xenDatabase } from "../../databaseConnection.js";
const sequelize = xenDatabase;

class XenDiscordRoles extends Model<InferAttributes<XenDiscordRoles>, InferCreationAttributes<XenDiscordRoles>> {
    declare id: number
    declare name: string
    declare role_id: string
    declare user_group_id: number
}

XenDiscordRoles.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    role_id: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
    },
    user_group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'opserv_discord_roles',
})

export default XenDiscordRoles;