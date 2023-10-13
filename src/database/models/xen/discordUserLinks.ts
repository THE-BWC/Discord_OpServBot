import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes
} from "sequelize";
import { xenDatabase } from "../../databaseConnection.js";
const sequelize = xenDatabase;

class XenDiscordUserLinks extends Model<InferAttributes<XenDiscordUserLinks>, InferCreationAttributes<XenDiscordUserLinks>> {
    declare user_id: number
    declare discord_user_id: string
    declare discord_username: string
    declare discord_discrim: string
}

XenDiscordUserLinks.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
    },
    discord_user_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    discord_username: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    discord_discrim: {
        type: DataTypes.STRING(8),
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'opserv_discord_user_links',
})

export default XenDiscordUserLinks;