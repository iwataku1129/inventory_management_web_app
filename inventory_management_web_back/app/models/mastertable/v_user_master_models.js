module.exports = (sequelize, Sequelize) => {
    const v_user_master = sequelize.define('v_user_master', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        inventory_category_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        inventory_category: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        inventory_category_path: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        user_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        priority: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        disable_flg: {
            type: Sequelize.TINYINT,
            allowNull: false,
        },
        del_flg: {
            type: Sequelize.TINYINT,
            allowNull: false,
        },
        created_by: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        updated_by: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return v_user_master;
};
