const db = require("../../models");
const v_report_stock_product = db.v_report_stock_product;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const { hasRequiredDelegatedPermissions } = require('../../../auth/permissionUtils');
const authConfig = require('../../../config/authConfig');
const accessUserInfo = require('../../../auth/accessUserInfo');


// Find a single v_report_stock_product with an id
exports.findOne = async (req, res) => {
    try {
        // Auth request
        if (!hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.webapp.delegatedPermissions.scopes)) {
            res.status(403).send({ message: 'User does not have the required permissions' });
            return;
        }

        // Validate request
        if (!req.params.id || !req.headers.invcat) {
            res.status(400).send({ message: "Content can not be empty!" })
            return;
        }

        // Auth request (accessUserId)
        try {
            await accessUserInfo(req.authInfo.preferred_username, req.authInfo.name, req.headers.invcat)
        } catch (e) {
            if (e.message === "accessUserId is not found") {
                res.status(403).send({ message: 'User does not have the required permissions' });
                return;
            } else {
                res.status(500).send({ message: e.message || "Some error occurred while retrieving." });
                return;
            }
        }

        // Get datas
        const get_data_one = await v_report_stock_product.findOne({ where: { [Op.and]: { id: req.params.id, inventory_category_path: req.headers.invcat } } })
        if (get_data_one) {
            res.send(get_data_one)
            return;
        }

        // error handle
        res.status(400).send({ message: "No registration" });
        return;
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: err.message || "Some error occurred while retrieving." });
        return;
    }
};


// Retrieve all v_report_stock_products from the database.
exports.findAll = async (req, res) => {
    try {
        // Auth request
        if (!hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.webapp.delegatedPermissions.scopes)) {
            res.status(403).send({ message: 'User does not have the required permissions' });
            return;
        }

        // Validate request
        if (!req.headers.invcat) {
            res.status(400).send({ message: "Content can not be empty!" })
            return;
        }

        // Auth request (accessUserId)
        try {
            await accessUserInfo(req.authInfo.preferred_username, req.authInfo.name, req.headers.invcat)
        } catch (e) {
            if (e.message === "accessUserId is not found") {
                res.status(403).send({ message: 'User does not have the required permissions' });
                return;
            } else {
                res.status(500).send({ message: e.message || "Some error occurred while retrieving." });
                return;
            }
        }

        // Get datas
        const get_data_all = await db.v_report_stock_product.findAll({ where: { [Op.and]: { inventory_category_path: req.headers.invcat, stock_cnt: { [Op.ne]: 0 }, phase: "complete" } }, order: [["product_code", "asc"]] })
        if (get_data_all.length >= 0) {
            res.send(get_data_all)
            return;
        }

        // error handle
        res.status(500).send({ message: "Some error occurred while retrieving." });
        return;
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: err.message || "Some error occurred while retrieving." });
        return;
    }
}


// Retrieve all v_report_stock_products from the database.
exports.findAllQuery = async (req, res) => {
    try {
        // Auth request
        if (!hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.webapp.delegatedPermissions.scopes)) {
            res.status(403).send({ message: 'User does not have the required permissions' });
            return;
        }

        // Validate request
        if (!req.headers.invcat || !req.query.date) {
            res.status(400).send({ message: "Content can not be empty!" })
            return;
        }

        // Auth request (accessUserId)
        try {
            await accessUserInfo(req.authInfo.preferred_username, req.authInfo.name, req.headers.invcat)
        } catch (e) {
            if (e.message === "accessUserId is not found") {
                res.status(403).send({ message: 'User does not have the required permissions' });
                return;
            } else {
                res.status(500).send({ message: e.message || "Some error occurred while retrieving." });
                return;
            }
        }

        // Get datas
        const date = req.query.date.match(/\d{4}\-\d{2}\-\d{2}/)
        const productCodeQuery = req.query.productCode ? ` and product.product_code='${req.query.productCode.replace("'", "\\'")}'` : ''
        const get_data_all = await sequelize.query(
            `select
                tables.order_id as id,
                tables.inventory_category_id as inventory_category_id,
                inv_cat.inventory_category as inventory_category,
                inv_cat.inventory_category_path as inventory_category_path,
                tables.order_check_date as order_check_date,
                tables.deliver_date as deliver_date,
                tables.product_id as product_id,
                product.product_code as product_code,
                product.product_name as product_name,
                product.supplier_id as supplier_id,
                supplier.supplier_code as supplier_code,
                supplier.supplier_name as supplier_name,
                product.unit as unit,
                product.tax_par as tax_par,
                product.product_kamoku_category_id as product_kamoku_category_id,
                kamoku.product_kamoku_category as product_kamoku_category,
                product.product_category_1_id as product_category_1_id,
                prd_cat1.product_category_1 as product_category_1,
                product.product_category_2_id as product_category_2_id,
                prd_cat2.product_category_2 as product_category_2,
                product.product_category_3_id as product_category_3_id,
                prd_cat3.product_category_3 as product_category_3,
                tables.order_product_status_id as order_product_status_id,
                order_sts.order_product_status as order_product_status,
                order_sts.phase as phase,
                sum(tables.order_price) as order_price,
                sum(tables.stock_cnt) as order_check_cnt_unit,
                tables.order_check_price_unit as order_check_price_unit,
                sum(tables.use_cnt) as use_cnt,
                ifnull(sum(tables.stock_cnt) - sum(tables.use_cnt), 0) as stock_cnt,
                sum(case when tables.category_name = '仕入' then tables.order_price when tables.category_name = '使用' then ifnull(tables.stock_cnt - tables.use_cnt, 0) * tables.order_check_price_unit else 0 end) as stock_price,
                max(tables.created_at) as created_at,
                max(tables.updated_at) as updated_at
            from
                (((((((((
                select
                    orders.id as order_id,
                    '仕入' as category_name,
                    orders.inventory_category_id as inventory_category_id,
                    orders.product_id as product_id,
                    orders.order_price as order_price,
                    orders.order_price / orders.order_check_cnt_unit as order_check_price_unit,
                    orders.order_check_date as order_check_date,
                    orders.deliver_date as deliver_date,
                    orders.order_check_cnt_unit as stock_cnt,
                    0 as use_cnt,
                    orders.order_product_status_id as order_product_status_id,
                    orders.created_at as created_at,
                    orders.updated_at as updated_at
                from
                    inventory_management_datas.tb_order_product orders
            union all
                select
                    orders.id as order_id,
                    '使用' as category_name,
                    day_rep.inventory_category_id as inventory_category_id,
                    orders.product_id as product_id,
                    0 as order_price,
                    orders.order_price / orders.order_check_cnt_unit as order_check_price_unit,
                    orders.order_check_date as order_check_date,
                    orders.deliver_date as deliver_date,
                    0 as stock_cnt,
                    day_rep.use_cnt as use_cnt,
                    orders.order_product_status_id as order_product_status_id,
                    day_rep.created_at as created_at,
                    day_rep.updated_at as updated_at
                from
                    (inventory_management_datas.tb_day_report_product day_rep
                join inventory_management_datas.tb_order_product orders on
                    (orders.id = day_rep.order_product_id))
                where day_rep.report_date <= '${date[0].replace("'", "\\'")}'
            ) tables
            join inventory_management_datas.tb_inventory_category inv_cat on
                (tables.inventory_category_id = inv_cat.id))
            join inventory_management_datas.tb_product_master_hist product on
                (tables.product_id = product.id
                    and tables.inventory_category_id = product.inventory_category_id))
            join inventory_management_datas.tb_supplier_master supplier on
                (product.supplier_id = supplier.id
                    and tables.inventory_category_id = supplier.inventory_category_id))
            left join inventory_management_datas.tb_product_kamoku_category kamoku on
                (product.product_kamoku_category_id = kamoku.id
                    and tables.inventory_category_id = kamoku.inventory_category_id))
            left join inventory_management_datas.tb_product_category_1 prd_cat1 on
                (product.product_category_1_id = prd_cat1.id
                    and tables.inventory_category_id = prd_cat1.inventory_category_id))
            left join inventory_management_datas.tb_product_category_2 prd_cat2 on
                (product.product_category_2_id = prd_cat2.id
                    and tables.inventory_category_id = prd_cat2.inventory_category_id))
            left join inventory_management_datas.tb_product_category_3 prd_cat3 on
                (product.product_category_3_id = prd_cat3.id
                    and tables.inventory_category_id = prd_cat3.inventory_category_id))
            join inventory_management_datas.tb_order_product_status order_sts on
                (tables.order_product_status_id = order_sts.id
                    and tables.inventory_category_id = order_sts.inventory_category_id))
            where
                inv_cat.inventory_category_path='${req.headers.invcat}' and order_sts.phase='complete'${productCodeQuery} and tables.deliver_date <= '${date[0].replace("'", "\\'")}'
            group by
                tables.order_id
            order by
                product.product_code,
                ifnull(sum(tables.stock_cnt) - sum(tables.use_cnt), 0) desc
            LIMIT 10000;`
            , {
                model: v_report_stock_product,
                mapToModel: true // pass true here if you have any mapped fields
            })
        if (get_data_all.length >= 0) {
            res.send(get_data_all)
            return;
        }

        // error handle
        res.status(500).send({ message: "Some error occurred while retrieving." });
        return;
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: err.message || "Some error occurred while retrieving." });
        return;
    }
}
