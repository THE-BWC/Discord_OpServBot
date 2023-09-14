import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
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

class DiscordThreadModel extends Model<InferAttributes<DiscordThreadModel>, InferCreationAttributes<DiscordThreadModel>> {
    // Auto-incrementing requires the declaration to be of CreationOptional<T>.
    // This is because the value is not required to be provided by the user and would confuse TypeScript.
    declare id: CreationOptional<number>
    declare thread_id: string
    declare channel_id: string
    declare guild_id: ForeignKey<string>
    declare created_date: number
    declare delete_at: CreationOptional<number> | null

    declare static associations: {
        guild: Association<DiscordThreadModel, DiscordGuildModel>;
    }

    declare getGuild: HasOneGetAssociationMixin<DiscordGuildModel>;
    declare setGuild: HasOneSetAssociationMixin<DiscordGuildModel, number>;
}

DiscordThreadModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    thread_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    channel_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    guild_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    created_date: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
    },
    delete_at: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
    }
}, {
    sequelize,
    tableName: 'threads'
})

export default DiscordThreadModel;