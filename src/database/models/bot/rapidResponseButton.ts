import { DiscordModalTypeEnum } from "../../../interfaces/enums.interface.js";
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
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin
} from "sequelize";
import {
    DiscordGuildModel,
    DiscordChannelModel
} from "./index.js";
import { botDatabase } from "../../databaseConnection.js";
const sequelize = botDatabase;

class DiscordRapidResponseButtonModel extends Model<InferAttributes<DiscordRapidResponseButtonModel>, InferCreationAttributes<DiscordRapidResponseButtonModel>> {
    // Auto-incrementing requires the declaration to be of CreationOptional<T>.
    // This is because the value is not required to be provided by the user and would confuse TypeScript.
    declare id: CreationOptional<number>
    declare label: string
    declare emoji: string
    declare role_id: string
    declare modal_type: DiscordModalTypeEnum
    declare channel_id: ForeignKey<string>
    declare guild_id: ForeignKey<string>
    declare created_date: number

    declare static associations: {
        guild: Association<DiscordRapidResponseButtonModel, DiscordGuildModel>;
        channel: Association<DiscordRapidResponseButtonModel, DiscordChannelModel>;
    }

    declare getGuild: HasOneGetAssociationMixin<DiscordGuildModel>;
    declare setGuild: HasOneSetAssociationMixin<DiscordGuildModel, number>;

    declare getChannel: BelongsToGetAssociationMixin<DiscordChannelModel>;
    declare setChannel: BelongsToSetAssociationMixin<DiscordChannelModel, number>;
}

DiscordRapidResponseButtonModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    label: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    emoji: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    role_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    modal_type: {
        type: DataTypes.ENUM(...Object.values(DiscordModalTypeEnum)),
        allowNull: false,
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
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: 'rapid_response_buttons'
})

export default DiscordRapidResponseButtonModel;