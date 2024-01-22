module.exports = (sequelize, Sequelize) => {
    const tb_product_master_hist = sequelize.define('tb_product_master_hist', {
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
        supplier_id: {
            type: Sequelize.INTEGER,
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
            allowNull: true,
        },
        product_category_1_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        product_category_2_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        product_category_3_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
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

    return tb_product_master_hist;
};
