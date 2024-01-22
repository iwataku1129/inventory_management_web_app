const db = require("../app/models");
const v_user_master = db.v_user_master;

const accessUserInfo = async (email, name, invcat) => {
    // Find a single tb_user_master with an id
    try {
        const get_data_one = await v_user_master.findOne({ where: { email: email, inventory_category_path: invcat, del_flg: 0 } })
        if (get_data_one) {
            return get_data_one.dataValues
        } else {
            throw new Error("accessUserId is not found")
            //const ret = await db.tb_user_master.create({user_name: name, email: email, inventory_category_id: 1, priority: 255, disable_flg: 0, del_flg: 0, created_by: 1, updated_by: 1})
            //return ret.dataValues
        }
    } catch (err) {
        if (err.message === "accessUserId is not found") {
            //console.error(`accessUserId is not found:${name} (${email})(${invcat})`)
            throw new Error("accessUserId is not found")
        } else {
            //console.error(err)
            throw err
        }
    }
};
module.exports = accessUserInfo;
