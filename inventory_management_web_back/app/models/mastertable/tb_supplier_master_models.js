module.exports = (sequelize, Sequelize) => {
    const tb_supplier_master = sequelize.define('tb_supplier_master', {
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
        supplier_code: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        corporation_code: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        Invoice_code: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        supplier_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        remarks: {
            type: Sequelize.STRING,
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

    return tb_supplier_master;
};
