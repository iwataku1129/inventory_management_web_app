module.exports = (sequelize, Sequelize) => {
    const v_supplier_master = sequelize.define('v_supplier_master', {
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

    return v_supplier_master;
};
