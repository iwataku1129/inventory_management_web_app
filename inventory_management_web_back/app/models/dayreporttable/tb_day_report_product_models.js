module.exports = (sequelize, Sequelize) => {
    const tb_day_report_product = sequelize.define('tb_day_report_product', {
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
        report_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        order_product_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        use_cnt: {
            type: Sequelize.DECIMAL(10, 2).UNSIGNED,
            allowNull: false,
        },
        day_report_product_category_id: {
            type: Sequelize.INTEGER,
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

    return tb_day_report_product;
};
