module.exports = (sequelize, Sequelize) => {
    const v_order_product_month = sequelize.define('v_order_product_month', {
        ids: {
            type: Sequelize.STRING,
            primaryKey: true,
            autoIncrement: false,
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
        product_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        supplier_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        supplier_code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        supplier_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        product_code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        product_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        unit: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        tax_par: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        order_price: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        order_check_price_unit: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        deliver_month: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        order_check_cnt_unit: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
            allowNull: false,
        },
        order_cnt: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
            allowNull: false,
        },
        order_cnt_unit: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
            allowNull: false,
        },
        order_product_status_id: {
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

    return v_order_product_month;
};
