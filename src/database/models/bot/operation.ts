import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes
} from "sequelize";
import { botDatabase } from "../../databaseConnection.js";
const sequelize = botDatabase;

class OperationModel extends Model<InferAttributes<OperationModel>, InferCreationAttributes<OperationModel>> {
    declare operation_id: number;
    declare operation_name: string;
    declare is_completed: boolean;
    declare type_name: string;
    declare date_start: number;
    declare date_end: number;
    declare leader_username: string;
    declare game_id: number;
    declare tag: string;
    declare game_name: string;
    declare edited_date: number;
    declare is_opsec: boolean;
    declare notified: boolean;
}

OperationModel.init({
    operation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    operation_name: {
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
    leader_username: {
        type: DataTypes.STRING,
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
    edited_date: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_opsec: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    notified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    tableName: 'operations',
})

export default OperationModel;