const db = require("../../models");
const tb_supplier_master = db.tb_supplier_master;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const { hasRequiredDelegatedPermissions } = require('../../../auth/permissionUtils');
const authConfig = require('../../../config/authConfig');
const accessUserInfo = require('../../../auth/accessUserInfo');
const getInvPath2InvCatId = require('../../../auth/getInvPath2InvCatId');


// Create and Save a new tb_supplier_master
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
        if (!req.headers.invcat || !req.body.supplier_code || !req.body.supplier_name) {
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
        const conflict_check = await tb_supplier_master.findOne({ where: { [Op.and]: { inventory_category_id: inventory_category_id, supplier_code: req.body.supplier_code, supplier_name: req.body.supplier_name, del_flg: 0 } } })
        if (conflict_check) {
            await tx.rollback();
            res.status(409).send({ message: "Parameter Conflict" })
            return;
        }

        // Set create data
        const tb_supplier_master_create = {
            inventory_category_id: inventory_category_id,
            supplier_code: req.body.supplier_code,
            corporation_code: req.body.corporation_code,
            Invoice_code: req.body.Invoice_code,
            supplier_name: req.body.supplier_name,
            remarks: req.body.remarks,
            del_flg: 0,
            created_by: userinfo.id,
            updated_by: userinfo.id,
        };

        // Save database
        const ret = await tb_supplier_master.create(tb_supplier_master_create, { transaction: tx })
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


// Update a tb_supplier_master by the id in the request
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
        const conflict_check = await tb_supplier_master.findOne({ where: { [Op.and]: { id: req.body.id, inventory_category_id: inventory_category_id, del_flg: 0 } }, order: [["updated_at", "desc"]] })
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
        const ret_update = await tb_supplier_master.update({
            //supplier_code: req.body.supplier_code,
            corporation_code: req.body.corporation_code,
            Invoice_code: req.body.Invoice_code,
            supplier_name: req.body.supplier_name,
            remarks: req.body.remarks,
            del_flg: 0,
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


// Delete a tb_supplier_master by the id in the request
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
        const conflict_check = await tb_supplier_master.findOne({ where: { [Op.and]: { id: req.params.id, inventory_category_id: inventory_category_id, del_flg: 0 } }, order: [["updated_at", "desc"]] })
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
        const ret_update = await tb_supplier_master.update({
            del_flg: 1,
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


// Find a single tb_supplier_master with an id
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
        const get_data_one = await tb_supplier_master.findOne({ where: { [Op.and]: { id: req.params.id, inventory_category_id: inventory_category_id, del_flg: 0 } } })
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


// Retrieve all tb_supplier_masters from the database.
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
        const get_data_all = await db.tb_supplier_master.findAll({ where: { inventory_category_id: inventory_category_id, del_flg: 0 }, order: [["id", "asc"]] })
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
