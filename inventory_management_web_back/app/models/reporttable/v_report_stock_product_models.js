module.exports = (sequelize, Sequelize) => {
    const v_report_stock_product = sequelize.define('v_report_stock_product', {
        id: {
            type: Sequelize.STRING,
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
        product_id: {
            type: Sequelize.STRING,
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
        product_kamoku_category: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        product_category_1: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        product_category_2: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        product_category_3: {
            type: Sequelize.STRING,
            allowNull: true,
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
        order_price: {
            type: Sequelize.DECIMAL(32, 0),
            allowNull: false,
        },
        order_check_cnt_unit: {
            type: Sequelize.DECIMAL(32, 2),
            allowNull: false,
        },
        use_cnt: {
            type: Sequelize.DECIMAL(32, 2),
            allowNull: false,
        },
        stock_cnt: {
            type: Sequelize.DECIMAL(32, 2),
            allowNull: false,
        },
        deliver_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        order_check_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return v_report_stock_product;
};
