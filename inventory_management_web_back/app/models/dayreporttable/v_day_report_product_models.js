module.exports = (sequelize, Sequelize) => {
    const v_day_report_product = sequelize.define('v_day_report_product', {
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
        report_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        order_product_id: {
            type: Sequelize.INTEGER,
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
        cost: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
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
        order_price: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        order_check_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        deliver_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        order_check_cnt_unit: {
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
        use_cnt: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
            allowNull: false,
        },
        stock_cnt: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
            allowNull: false,
        },
        day_report_product_category_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        day_report_product_category: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        remarks: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        disable_flg: {
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

    return v_day_report_product;
};
