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
    DiscordThreadModel,
    DiscordChannelModel
} from "./index.js";
import { botDatabase } from "../../databaseConnection.js";
const sequelize = botDatabase;

class DiscordGuildModel extends Model<InferAttributes<DiscordGuildModel>, InferCreationAttributes<DiscordGuildModel>> {
    declare guild_id: string
    declare log_channel_id: CreationOptional<string> | null
    declare created_date: number

    declare static associations: {
        threads: Association<DiscordGuildModel, DiscordThreadModel>;
        channels: Association<DiscordGuildModel, DiscordChannelModel>;
    }

    declare getThreads: HasManyGetAssociationsMixin<DiscordThreadModel>;
    declare addThread: HasManyAddAssociationMixin<DiscordThreadModel, number>;
    declare removeThread: HasManyRemoveAssociationMixin<DiscordThreadModel, number>;

    declare getChannels: HasManyGetAssociationsMixin<DiscordChannelModel>;
    declare addChannel: HasManyAddAssociationMixin<DiscordChannelModel, number>;
    declare removeChannel: HasManyRemoveAssociationMixin<DiscordChannelModel, number>;
}

DiscordGuildModel.init({
    guild_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        primaryKey: true,
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
    tableName: 'guilds'
})

export default DiscordGuildModel;