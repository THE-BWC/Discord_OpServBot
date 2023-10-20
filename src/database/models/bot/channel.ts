import { DiscordChannelTypeEnum } from "../../../interfaces/enums.interface.js";
import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    ForeignKey,
    Association,
    HasOneGetAssociationMixin,
    HasOneSetAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyRemoveAssociationMixin,
} from "sequelize";
import {
    DiscordGuildModel,
    DiscordRapidResponseButtonModel
} from "./index.js";
import { botDatabase } from "../../databaseConnection.js";
const sequelize = botDatabase;

class DiscordChannelModel extends Model<InferAttributes<DiscordChannelModel>, InferCreationAttributes<DiscordChannelModel>> {
    declare channel_id: string
    declare type: string
    declare game_id: number | null
    declare guild_id: ForeignKey<string>
    declare created_date: number

    declare static associations: {
        guild: Association<DiscordChannelModel, DiscordGuildModel>;
        rapid_response_button: Association<DiscordChannelModel, DiscordRapidResponseButtonModel>;
    }

    declare getGuild: HasOneGetAssociationMixin<DiscordGuildModel>;
    declare setGuild: HasOneSetAssociationMixin<DiscordGuildModel, number>;

    declare getRapidResponseButtons: HasManyGetAssociationsMixin<DiscordRapidResponseButtonModel>;
    declare addRapidResponseButton: HasManyAddAssociationMixin<DiscordRapidResponseButtonModel, number>;
    declare removeRapidResponseButton: HasManyRemoveAssociationMixin<DiscordRapidResponseButtonModel, number>;
}

DiscordChannelModel.init({
    channel_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
    },
    type: {
        type: DataTypes.ENUM(...Object.values(DiscordChannelTypeEnum)),
        allowNull: false,
        unique: true,
    },
    game_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    guild_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    created_date: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
    }
}, {
    sequelize,
    tableName: 'channels'
})

export default DiscordChannelModel;