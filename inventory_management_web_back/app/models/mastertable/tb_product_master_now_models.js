module.exports = (sequelize, Sequelize) => {
    const tb_product_master_now = sequelize.define('tb_product_master_now', {
        inventory_category_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        product_code: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        product_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return tb_product_master_now;
};
