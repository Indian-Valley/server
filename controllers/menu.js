const supabase = require('../supabaseClient.js');

// async function getMenuItemImage(req, res) {
//     const { item_id } = req.params;
//
//     if (!item_id) {
//         res.status(400).send({success: false, error: 'No item id provided'});
//     }
//
//     const { data, error } = await supabase
//         .from('menu_images')
//         .select('*')
//         .eq('customer_id', customer_id)
//
//     if (error) {
//         console.error(error);
//         return res.status(400).json({success: false, error: "Failed to get customer address", fullError: error});
//     }
//
//     return res.status(200).json({success: true, data: data});
// }

async function getMenuItems(req, res) {
    const { data, error } = await supabase
        .from('menu_items')
        .select('*')

    if (error) {
        console.error(error);
        return res.status(400).json({success: false, error: "Failed to get menu items", fullError: error});
    }

    return res.status(200).json({success: true, data: data});
}

async function getMenuCategories(req, res) {
    const { data, error } = await supabase
        .from('menu_categories')
        .select('*')

    if (error) {
        console.error(error);
        return res.status(400).json({success: false, error: "Failed to get menu categories", fullError: error});
    }

    return res.status(200).json({success: true, data: data});
}

module.exports = {
    getMenuItems, getMenuCategories
}