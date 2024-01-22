module.exports = (sequelize, Sequelize) => {
    const tb_order_product_status = sequelize.define('tb_order_product_status', {
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
        order_product_status: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        phase: {
            type: Sequelize.ENUM('order', 'check', 'complete', 'cancel'),
            allowNull: false,
        },
        del_flg: {
            type: Sequelize.TINYINT,
            allowNull: false,
        },
        created_by: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        updated_by: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return tb_order_product_status;
};
