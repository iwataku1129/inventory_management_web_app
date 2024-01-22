module.exports = (sequelize, Sequelize) => {
    const v_product_master_hist = sequelize.define('v_product_master_hist', {
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
        contents: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
            allowNull: false,
        },
        ratio: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        remarks: {
            type: Sequelize.STRING,
            allowNull: true,
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
        product_id_now: {
            type: Sequelize.INTEGER,
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

    return v_product_master_hist;
};
