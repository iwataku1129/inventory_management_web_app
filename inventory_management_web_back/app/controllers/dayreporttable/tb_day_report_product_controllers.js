const db = require("../../models");
const tb_day_report_product = db.tb_day_report_product;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const { hasRequiredDelegatedPermissions } = require('../../../auth/permissionUtils');
const authConfig = require('../../../config/authConfig');
const accessUserInfo = require('../../../auth/accessUserInfo');
const getInvPath2InvCatId = require('../../../auth/getInvPath2InvCatId');


// Create and Save a new tb_day_report_product
exports.create = async (req, res) => {
    const tx = await sequelize.transaction();
    try {
        // Auth request (permissions)
        if (!hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.webapp.delegatedPermissions.scopes)) {
            await tx.rollback();
            res.status(403).send({ message: 'User does not have the required permissions' });
            return;
        }

        // Validate request
        if (!req.headers.invcat || !req.body.report_date || !req.body.order_product_id || req.body.use_cnt === null) {
            await tx.rollback();
            res.status(400).send({ message: "Content can not be empty!" })
            return;
        }

        // Auth request (accessUserId)
        let userinfo
        try {
            userinfo = await accessUserInfo(req.authInfo.preferred_username, req.authInfo.name, req.headers.invcat)
        } catch (e) {
            if (e.message === "accessUserId is not found") {
                res.status(403).send({ message: 'User does not have the required permissions' });
                return;
            } else {
                res.status(500).send({ message: e.message || "Some error occurred while retrieving." });
                return;
            }
        }

        // invcat → inventory_category_id 取得
        let inventory_category_id
        try {
            inventory_category_id = await getInvPath2InvCatId(req.headers.invcat)
        } catch (err) {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving." })
            return;
        }

        // 重複チェック
        //const conflict_check = await tb_day_report_product.findOne({ where: { [Op.and]: { inventory_category_id: inventory_category_id, report_date: req.body.report_date, order_product_id: req.body.order_product_id, disable_flg: 0 } } })
        //if (conflict_check) {
        //    await tx.rollback();
        //    res.status(409).send({ message: "Parameter Conflict" })
        //    return;
        //}

        // 在庫同期判定
        const stock_check = await db.v_report_stock_product.findOne({ where: { [Op.and]: { id: req.body.order_product_id, inventory_category_id: inventory_category_id, stock_cnt: { [Op.lt]: req.body.use_cnt } } } })
        if (stock_check) {
            await tx.rollback();
            res.status(400).send({ message: "use_cnt is out of range" })
            return;
        }

        // Set create data
        const tb_day_report_product_create = {
            inventory_category_id: inventory_category_id,
            report_date: req.body.report_date,
            order_product_id: req.body.order_product_id,
            use_cnt: req.body.use_cnt,
            day_report_product_category_id: req.body.day_report_product_category_id,
            remarks: req.body.remarks,
            disable_flg: 0,
            created_by: userinfo.id,
            updated_by: userinfo.id,
        };

        // Save database
        const ret = await tb_day_report_product.create(tb_day_report_product_create, { transaction: tx })
        if (ret && ret.dataValues) {
            await tx.commit();
            res.send(ret.dataValues)
            return;
        }

        // error handle
        await tx.rollback();
        res.status(500).send({ message: "Some error occurred while retrieving." })
        return;
    } catch (err) {
        await tx.rollback();
        console.error(err)
        res.status(500).send({ message: err.message || "Some error occurred while retrieving." })
        return;
    }
}


// Update a tb_day_report_product by the id in the request
exports.update = async (req, res) => {
    const tx = await sequelize.transaction();
    try {
        // Auth request
        if (!hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.webapp.delegatedPermissions.scopes)) {
            await tx.rollback();
            res.status(403).send({ message: 'User does not have the required permissions' });
            return;
        }

        // Validate request
        if (!req.body.id || !req.headers.invcat || !req.headers.opentime) {
            await tx.rollback();
            res.status(400).send({ message: "does not include where" });
            return;
        }

        // Auth request (accessUserId)
        let userinfo
        try {
            userinfo = await accessUserInfo(req.authInfo.preferred_username, req.authInfo.name, req.headers.invcat)
        } catch (e) {
            if (e.message === "accessUserId is not found") {
                res.status(403).send({ message: 'User does not have the required permissions' });
                return;
            } else {
                res.status(500).send({ message: e.message || "Some error occurred while retrieving." });
                return;
            }
        }

        // invcat → inventory_category_id 取得
        let inventory_category_id
        try {
            inventory_category_id = await getInvPath2InvCatId(req.headers.invcat)
        } catch (err) {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving." })
            return;
        }

        // set query
        const options = { where: {}, transaction: tx };
        options.where['id'] = Number(req.body.id);
        options.where['inventory_category_id'] = inventory_category_id;

        // 登録実績・同期チェック
        const conflict_check = await tb_day_report_product.findOne({ where: { [Op.and]: { id: req.body.id, inventory_category_id: inventory_category_id, disable_flg: 0 } }, order: [["updated_at", "desc"]] })
        if (!conflict_check) {
            await tx.rollback();
            res.status(400).send({ message: "No registration" })
            return;
        } else if (conflict_check.updated_at >= req.headers.opentime) {
            await tx.rollback();
            res.status(409).send({ message: "Update Conflict" })
            return;
        }

        // 在庫同期判定
        const stock_check = await db.v_report_stock_product.findOne({ where: { [Op.and]: { id: req.body.order_product_id, inventory_category_id: inventory_category_id } } })
        if (!stock_check) {
            await tx.rollback();
            res.status(400).send({ message: "No registration" })
        } else if (Number(stock_check.stock_cnt) < (Number(req.body.use_cnt) - Number(conflict_check.use_cnt))) {
            await tx.rollback();
            res.status(400).send({ message: "use_cnt is out of range" })
            return;
        }

        // Set update data and Save database
        const ret_update = await tb_day_report_product.update({
            //inventory_category_id: inventory_category_id,
            report_date: req.body.report_date,
            order_product_id: req.body.order_product_id,
            use_cnt: req.body.use_cnt,
            day_report_product_category_id: req.body.day_report_product_category_id,
            remarks: req.body.remarks,
            disable_flg: 0,
            updated_by: userinfo.id,
        }, options)
        if (ret_update[0] === 0) {
            await tx.commit();
            res.status(200).send({ message: "Already registered" })
            return;
        } else {
            await tx.commit();
            res.status(201).send({ message: `Update completed: ${ret_update[0]}` })
            return;
        }

        // error handle
        await tx.rollback();
        res.status(500).send({ message: "Some error occurred while retrieving." });
        return;
    } catch (err) {
        await tx.rollback();
        console.error(err)
        res.status(500).send({ message: err.message || "Some error occurred while retrieving." });
        return;
    }
}


// Delete a tb_day_report_product by the id in the request
exports.delete = async (req, res) => {
    const tx = await sequelize.transaction();
    try {
        // Auth request
        if (!hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.webapp.delegatedPermissions.scopes)) {
            await tx.rollback();
            res.status(403).send({ message: 'User does not have the required permissions' });
            return;
        }

        // Validate request
        if (!req.params.id || !req.headers.invcat || !req.headers.opentime) {
            await tx.rollback();
            res.status(400).send({ message: "does not include where" });
            return;
        }

        // Auth request (accessUserId)
        let userinfo
        try {
            userinfo = await accessUserInfo(req.authInfo.preferred_username, req.authInfo.name, req.headers.invcat)
        } catch (e) {
            if (e.message === "accessUserId is not found") {
                res.status(403).send({ message: 'User does not have the required permissions' });
                return;
            } else {
                res.status(500).send({ message: e.message || "Some error occurred while retrieving." });
                return;
            }
        }

        // invcat → inventory_category_id 取得
        let inventory_category_id
        try {
            inventory_category_id = await getInvPath2InvCatId(req.headers.invcat)
        } catch (err) {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving." })
            return;
        }

        // set query
        const options = { where: {}, transaction: tx };
        options.where['id'] = Number(req.params.id);
        options.where['inventory_category_id'] = inventory_category_id;

        // 登録実績チェック
        const conflict_check = await tb_day_report_product.findOne({ where: { [Op.and]: { id: req.params.id, inventory_category_id: inventory_category_id, disable_flg: 0 } }, order: [["updated_at", "desc"]] })
        if (!conflict_check) {
            await tx.rollback();
            res.status(400).send({ message: "No registration" })
            return;
        } else if (conflict_check.updated_at >= req.headers.opentime) {
            await tx.rollback();
            res.status(409).send({ message: "Update Conflict" })
            return;
        } else if (Number(conflict_check.use_cnt || 999) !== 0) {
            await tx.rollback();
            res.status(400).send({ message: "use_cnt is out of range" })
            return;
        }

        // Set update data and Save database
        const ret_update = await tb_day_report_product.update({
            disable_flg: 1,
            updated_by: userinfo.id,
        }, options)
        if (ret_update[0] === 0) {
            await tx.commit();
            res.status(200).send({ message: "Already registered" })
            return;
        } else {
            await tx.commit();
            res.status(201).send({ message: `Update completed: ${ret_update[0]}` })
            return;
        }

        // error handle
        await tx.rollback();
        res.status(500).send({ message: "Some error occurred while retrieving." });
        return;
    } catch (err) {
        await tx.rollback();
        console.error(err)
        res.status(500).send({ message: err.message || "Some error occurred while retrieving." });
        return;
    }
}


// Find a single tb_day_report_product with an id
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

        // invcat → inventory_category_id 取得
        let inventory_category_id
        try {
            inventory_category_id = await getInvPath2InvCatId(req.headers.invcat)
        } catch (err) {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving." })
            return;
        }

        // Get datas
        const get_data_one = await tb_day_report_product.findOne({ where: { [Op.and]: { id: req.params.id, inventory_category_id: inventory_category_id, disable_flg: 0 } } })
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


// Retrieve all tb_day_report_products from the database.
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

        // invcat → inventory_category_id 取得
        let inventory_category_id
        try {
            inventory_category_id = await getInvPath2InvCatId(req.headers.invcat)
        } catch (err) {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving." })
            return;
        }

        // Get datas
        const get_data_all = await db.tb_day_report_product.findAll({ where: { inventory_category_id: inventory_category_id, disable_flg: 0 }, order: [["id", "asc"]] })
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
