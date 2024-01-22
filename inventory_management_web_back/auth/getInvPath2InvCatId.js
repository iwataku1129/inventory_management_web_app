const db = require("../app/models");
const tb_inventory_category = db.tb_inventory_category;

const getInvPath2InvCatId = async (invcat) => {
    // Find a single tb_inventory_category with an id
    try {
        const get_data_one = await tb_inventory_category.findOne({ where: { inventory_category_path: invcat } })
        if (get_data_one) {
            return get_data_one.dataValues.id
        } else {
            throw "inventory_category is not found"
        }
    } catch (err) {
        if (err === "inventory_category is not found") {
            console.error(`inventory_category is not found:${invcat}`)
            throw "inventory_category is not found"
        } else {
            console.error(err)
            throw "Some error occurred while getting inventory_category."
        }
    }
};
module.exports = getInvPath2InvCatId;
