module.exports = (sequelize, Sequelize) => {
    const tb_order_product = sequelize.define('tb_order_product', {
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
        product_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        order_cnt: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
            allowNull: false,
        },
        order_price: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        order_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        deliver_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        order_check_date: {
            type: Sequelize.DATEONLY,
            allowNull: true,
        },
        order_check_cnt_unit: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
            allowNull: false,
        },
        order_product_status_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        remarks: {
            type: Sequelize.STRING,
            allowNull: true,
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

    return tb_order_product;
};
