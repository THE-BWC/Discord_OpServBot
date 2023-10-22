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
    declare game_id: number;
    declare notified: boolean;
}

OperationModel.init({
    operation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    game_id: {
        type: DataTypes.INTEGER,
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