const db = require("../app/models");
const tb_user_master = db.tb_user_master;

// 初回アクセス時 サンプルページ権限付与
const accessUserInfo = async (email, name) => {
    // Find a single tb_user_master with an id
    try {
        const get_data_one = await tb_user_master.findOne({ where: { email: email, del_flg: 0 } })
        if (get_data_one) {
            return get_data_one.dataValues
        } else {
            const ret = await tb_user_master.create({ user_name: name, email: email, inventory_category_id: 1, priority: 255, disable_flg: 0, del_flg: 0, created_by: 1, updated_by: 1 })
            return ret.dataValues
            //throw "accessUserId is not found"
        }
    } catch (err) {
        if (err === "accessUserId is not found") {
            console.error(`accessUserId is not found:${name} (${email})`)
            throw "accessUserId is not found"
        } else {
            console.error(err)
            throw "Some error occurred while getting accessUserId."
        }
    }
};
module.exports = accessUserInfo;
