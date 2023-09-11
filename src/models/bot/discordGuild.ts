import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Association,
    HasManyAddAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyRemoveAssociationMixin,
} from "sequelize";
import {
    DiscordThreadModel
} from "./index.js";
import { botDatabase } from "../../lib/index.js";
const sequelize = botDatabase;

class DiscordGuildModel extends Model<InferAttributes<DiscordGuildModel>, InferCreationAttributes<DiscordGuildModel>> {
    declare id: number
    declare guild_id: string
    declare log_channel_id: CreationOptional<string> | null
    declare created_date: number

    declare static associations: {
        threads: Association<DiscordGuildModel, DiscordThreadModel>;
    }

    declare getThreads: HasManyGetAssociationsMixin<DiscordThreadModel>;
    declare addThread: HasManyAddAssociationMixin<DiscordThreadModel, number>;
    declare removeThread: HasManyRemoveAssociationMixin<DiscordThreadModel, number>;
}

DiscordGuildModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    guild_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    log_channel_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    created_date: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
    }
}, {
    sequelize,
    tableName: 'discord_guilds'
})

export default DiscordGuildModel;