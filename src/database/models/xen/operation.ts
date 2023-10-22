import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes
} from "sequelize";
import { xenDatabase } from "../../databaseConnection.js";
const sequelize = xenDatabase;

class XenOpservOperationModel extends Model<InferAttributes<XenOpservOperationModel>, InferCreationAttributes<XenOpservOperationModel>> {
    declare operation_id: number;
    declare operation_name: string;
    declare description: string;
    declare is_completed: boolean;
    declare type_name: string;
    declare date_start: number;
    declare date_end: number;
    declare leader_user_id: number;
    declare game_id: number;
    declare tag: string;
    declare game_name: string;
    declare is_opsec: boolean;
    declare discord_voice_channel_id: string;
    declare discord_event_location: string;
    declare edited_date: number;
}

XenOpservOperationModel.init({
    operation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    operation_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    type_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date_start: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_end: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    leader_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    game_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: false
    },
    game_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_opsec: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    discord_voice_channel_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    discord_event_location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    edited_date: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'opserv_operations',
})

export default XenOpservOperationModel;