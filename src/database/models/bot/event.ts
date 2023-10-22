import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    ForeignKey,
    Association,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
} from "sequelize";
import {
    DiscordGuildModel
} from "./index.js";
import { botDatabase } from "../../databaseConnection.js";
const sequelize = botDatabase;

class DiscordEventModel extends Model<InferAttributes<DiscordEventModel>, InferCreationAttributes<DiscordEventModel>> {
    // Auto-incrementing requires the declaration to be of CreationOptional<T>.
    // This is because the value is not required to be provided by the user and would confuse TypeScript.
    declare event_id: string
    declare operation_id: number
    declare operation_edited_date: number
    declare guild_id: ForeignKey<string>

    declare static associations: {
        guild: Association<DiscordEventModel, DiscordGuildModel>;
    }

    declare getGuild: HasOneGetAssociationMixin<DiscordGuildModel>;
    declare setGuild: HasOneSetAssociationMixin<DiscordGuildModel, number>;
}

DiscordEventModel.init({
    event_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    operation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    operation_edited_date: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    guild_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'events'
})

export default DiscordEventModel;