const db = require("../../models");
const tb_inventory_category = db.tb_inventory_category;
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;
const { hasRequiredDelegatedPermissions } = require('../../../auth/permissionUtils');
const authConfig = require('../../../config/authConfig');
const accessUserInfo = require('../../../auth/accessUserInfo');
const getInvPath2InvCatId = require('../../../auth/getInvPath2InvCatId');


// Create and Save a new tb_inventory_category
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
        if (!req.body.inventory_category || !req.body.inventory_category_path) {
            await tx.rollback();
            res.status(400).send({ message: "Content can not be empty!" })
            return;
        }

        // Auth request (accessUserId)
        let userinfo
        try {
            userinfo = await accessUserInfo(req.authInfo.preferred_username, req.authInfo.name, "sample")
        } catch (e) {
            if (e.message === "accessUserId is not found") {
                res.status(403).send({ message: 'User does not have the required permissions' });
                return;
            } else {
                res.status(500).send({ message: e.message || "Some error occurred while retrieving." });
                return;
            }
        }

        // 重複チェック
        const conflict_check = await tb_inventory_category.findOne({ where: { [Op.or]: { inventory_category: req.body.inventory_category, inventory_category_path: req.body.inventory_category_path } } })
        if (conflict_check) {
            await tx.rollback();
            res.status(409).send({ message: "Parameter Conflict" })
            return;
        }

        // Set create data
        const tb_inventory_category_create = {
            inventory_category: req.body.inventory_category,
            inventory_category_path: req.body.inventory_category_path,
            created_by: userinfo.id,
            updated_by: userinfo.id,
        };

        // Save database
        const ret = await tb_inventory_category.create(tb_inventory_category_create, { transaction: tx })
        if (ret && ret.dataValues) {
            const invCatId = ret.dataValues.id
            // [post]user master
            const retUsr = await db.tb_user_master.create({ user_name: "system", email: "admin@xxx.com", inventory_category_id: invCatId, created_by: 1, updated_by: 1, priority: 255, disable_flg: 0, del_flg: 0 }, { transaction: tx })
            // [post]order_product_status
            const userid = retUsr.dataValues.id
            await db.tb_order_product_status.bulkCreate([
                { inventory_category_id: invCatId, order_product_status: "1.発注済", phase: "order", del_flg: 0, created_by: userid, updated_by: userid },
                { inventory_category_id: invCatId, order_product_status: "2.納品済", phase: "check", del_flg: 0, created_by: userid, updated_by: userid },
                { inventory_category_id: invCatId, order_product_status: "3.検品済", phase: "complete", del_flg: 0, created_by: userid, updated_by: userid },
                { inventory_category_id: invCatId, order_product_status: "999.キャンセル", phase: "cancel", del_flg: 0, created_by: userid, updated_by: userid },
            ], { transaction: tx })
            // [post]day_report_product_category
            await db.tb_day_report_product_category.bulkCreate([
                { inventory_category_id: invCatId, day_report_product_category: "通常使用", del_flg: 0, created_by: userid, updated_by: userid },
                { inventory_category_id: invCatId, day_report_product_category: "登録誤り訂正", del_flg: 0, created_by: userid, updated_by: userid },
            ], { transaction: tx })

            // commit
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
