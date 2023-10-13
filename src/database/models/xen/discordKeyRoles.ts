import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes
} from "sequelize";
import { xenDatabase } from "../../databaseConnection.js";
const sequelize = xenDatabase;

class XenDiscordKeyRoles extends Model<InferAttributes<XenDiscordKeyRoles>, InferCreationAttributes<XenDiscordKeyRoles>> {
    declare id: number
    declare role_id: string
    declare name: string
}

XenDiscordKeyRoles.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    role_id: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'opserv_discord_key_roles',
})

export default XenDiscordKeyRoles;