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
import { botDatabase } from "../../lib/index.js";
const sequelize = botDatabase;

class DiscordThreadModel extends Model<InferAttributes<DiscordThreadModel>, InferCreationAttributes<DiscordThreadModel>> {
    declare id: number
    declare thread_id: string
    declare channel_id: string
    declare guild_id: ForeignKey<string>
    declare created_date: number

    declare static associations: {
        guild: Association<DiscordThreadModel, DiscordThreadModel>;
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
}, {
    sequelize,
    tableName: 'discord_threads'
})

export default DiscordThreadModel;