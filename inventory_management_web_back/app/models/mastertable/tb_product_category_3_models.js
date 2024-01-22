module.exports = (sequelize, Sequelize) => {
    const tb_product_category_3 = sequelize.define('tb_product_category_3', {
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
        product_category_3: {
            type: Sequelize.STRING,
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

    return tb_product_category_3;
};
