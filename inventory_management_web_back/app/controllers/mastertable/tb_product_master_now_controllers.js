const db = require("../../models");
const tb_product_master_now = db.tb_product_master_now;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const { hasRequiredDelegatedPermissions } = require('../../../auth/permissionUtils');
const authConfig = require('../../../config/authConfig');
const accessUserInfo = require('../../../auth/accessUserInfo');
const getInvPath2InvCatId = require('../../../auth/getInvPath2InvCatId');


// Create and Save a new tb_product_master_now
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
        if (!req.headers.invcat || !req.body.supplier_id || !req.body.product_code || !req.body.product_name || !req.body.unit || !req.body.contents || !req.body.ratio || !req.body.tax_par) {
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
        
        // [hist]create data
        const tb_product_master_hist_create = {
            inventory_category_id: inventory_category_id,
            supplier_id: req.body.supplier_id,
            product_code: req.body.product_code,
            product_name: req.body.product_name,
            unit: req.body.unit,
            contents: req.body.contents,
            ratio: req.body.ratio,
            remarks: req.body.remarks,
            tax_par: req.body.tax_par,
            product_kamoku_category_id: req.body.product_kamoku_category_id,
            product_category_1_id: req.body.product_category_1_id,
            product_category_2_id: req.body.product_category_2_id,
            product_category_3_id: req.body.product_category_3_id,
            del_flg: 0,
            created_by: userinfo.id,
            updated_by: userinfo.id,
        };

        // [hist]Save database
        let product_id
        const ret = await db.tb_product_master_hist.create(tb_product_master_hist_create, { transaction: tx })
        if (ret && ret.dataValues) {
            product_id = ret.dataValues.id
        } else {
            // error handle
            await tx.rollback();
            res.status(500).send({ message: "Some error occurred while retrieving." })
            return;
        }

        // [now]重複チェック・create or update
        const conflict_check = await tb_product_master_now.findOne({ where: { [Op.and]: { inventory_category_id: inventory_category_id, product_code: req.body.product_code } } })
        if (!conflict_check) {
            // [now]Set create data
            const tb_product_master_now_create = {
                inventory_category_id: inventory_category_id,
                product_code: req.body.product_code,
                product_id: product_id,
            };

            // [now]Save database
            const ret = await tb_product_master_now.create(tb_product_master_now_create, { transaction: tx })
            if (ret && ret.dataValues) {
                await tx.commit();
                res.send(ret.dataValues)
                return;
            }

            // error handle
            await tx.rollback();
            res.status(500).send({ message: "Some error occurred while retrieving." })
            return;
        } else {
            // [now]set query
            const options = { where: {}, transaction: tx };
            options.where['product_code'] = Number(req.body.product_code);
            options.where['inventory_category_id'] = inventory_category_id;

            // 登録実績 ・ 同期チェック
            const conflict_check = await tb_product_master_now.findOne({ where: { [Op.and]: { product_code: req.body.product_code, inventory_category_id: inventory_category_id } }, order: [["updated_at", "desc"]] })
            if (!conflict_check) {
                await tx.rollback();
                res.status(400).send({ message: "No registration" })
                return;
            } else if (conflict_check.updated_at >= req.headers.opentime) {
                await tx.rollback();
                res.status(409).send({ message: "Update Conflict" })
                return;
            }

            // Set update data and Save database
            const ret_update = await tb_product_master_now.update({
                product_id: product_id,
            }, options)
            await tx.commit();
            res.send({ product_id: product_id, product_code: req.body.product_code })
            return;

            // error handle
            await tx.rollback();
            res.status(500).send({ message: "Some error occurred while retrieving." });
            return;
        }
    } catch (err) {
        await tx.rollback();
        console.error(err)
        res.status(500).send({ message: err.message || "Some error occurred while retrieving." })
        return;
    }
}

// Delete a tb_product_master_now by the id in the request
exports.delete = async (req, res) => {
    const tx = await sequelize.transaction();
    try {
        // Auth request (permissions)
        if (!hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.webapp.delegatedPermissions.scopes)) {
            await tx.rollback();
            res.status(403).send({ message: 'User does not have the required permissions' });
            return;
        }

        // Validate request
        if (!req.headers.invcat || !req.body.product_code || !req.body.product_id) {
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

        // [hist]create data
        const tb_product_master_hist_create = {
            del_flg: 1,
            created_by: userinfo.id,
            updated_by: userinfo.id,
        };

        // [hist]Save database
        let product_id
        const ret = await db.tb_product_master_hist.create(tb_product_master_hist_create, { transaction: tx })
        if (ret && ret.dataValues) {
            product_id = ret.dataValues.id
        } else {
            // error handle
            await tx.rollback();
            res.status(500).send({ message: "Some error occurred while retrieving." })
            return;
        }

        // [now]重複チェック・create or update
        const conflict_check = await tb_product_master_now.findOne({ where: { [Op.and]: { inventory_category_id: inventory_category_id, product_code: req.body.product_code } } })
        if (!conflict_check) {
            // [now]Set create data
            const tb_product_master_now_create = {
                inventory_category_id: inventory_category_id,
                product_code: req.body.product_code,
                product_id: product_id,
            };

            // [now]Save database
            const ret = await tb_product_master_now.create(tb_product_master_now_create, { transaction: tx })
            if (ret && ret.dataValues) {
                await tx.commit();
                res.send(ret.dataValues)
                return;
            }

            // error handle
            await tx.rollback();
            res.status(500).send({ message: "Some error occurred while retrieving." })
            return;
        } else {
            // [now]set query
            const options = { where: {}, transaction: tx };
            options.where['product_code'] = Number(req.body.product_code);
            options.where['inventory_category_id'] = inventory_category_id;

            // 登録実績 ・ 同期チェック
            const conflict_check = await tb_product_master_now.findOne({ where: { [Op.and]: { product_code: req.body.product_code, inventory_category_id: inventory_category_id } }, order: [["updated_at", "desc"]] })
            if (!conflict_check) {
                await tx.rollback();
                res.status(400).send({ message: "No registration" })
                return;
            } else if (conflict_check.updated_at >= req.headers.opentime) {
                await tx.rollback();
                res.status(409).send({ message: "Update Conflict" })
                return;
            }

            // Set update data and Save database
            const ret_update = await tb_product_master_now.update({
                product_id: product_id,
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
        }
    } catch (err) {
        await tx.rollback();
        console.error(err)
        res.status(500).send({ message: err.message || "Some error occurred while retrieving." })
        return;
    }
}


// Find a single tb_product_master_now with an id
exports.findOne = async (req, res) => {
    try {
        // Auth request
        if (!hasRequiredDelegatedPermissions(req.authInfo, authConfig.protectedRoutes.webapp.delegatedPermissions.scopes)) {
            res.status(403).send({ message: 'User does not have the required permissions' });
            return;
        }

        // Validate request
        if (!req.params.product_code || !req.headers.invcat) {
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
        const get_data_one = await tb_product_master_now.findOne({ where: { [Op.and]: { product_code: req.params.product_code, inventory_category_id: inventory_category_id, del_flg: 0 } } })
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


// Retrieve all tb_product_master_nows from the database.
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
        const get_data_all = await db.tb_product_master_now.findAll({ where: { inventory_category_id: inventory_category_id, del_flg: 0 }, order: [["id", "asc"]] })
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
