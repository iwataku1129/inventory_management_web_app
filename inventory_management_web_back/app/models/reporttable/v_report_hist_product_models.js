module.exports = (sequelize, Sequelize) => {
    const v_report_hist_product = sequelize.define('v_report_hist_product', {
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
        category_name: {
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
        product_kamoku_category_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        product_kamoku_category: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        product_category_1_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        product_category_1: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        product_category_2_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        product_category_2: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        product_category_3_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        product_category_3: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        order_check_price_unit: {
            type: Sequelize.DECIMAL(16, 4).UNSIGNED,
            allowNull: false,
        },
        report_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        stock_cnt: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
            allowNull: false,
        },
        use_cnt: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
            allowNull: false,
        },
        calc_cnt: {
            type: Sequelize.DECIMAL(11, 2).UNSIGNED,
            allowNull: false,
        },
        stock_price: {
            type: Sequelize.DECIMAL(10, 2),
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

    return v_report_hist_product;
};
