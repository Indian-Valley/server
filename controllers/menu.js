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

global.menuItems = []
global.itemPrices = {}
global.menuSetAt = null;

function setMenuItem(items) {
    global.menuSetAt = Date.now()
    global.menuItems = items

    for (const item of items) {

        const inPence = Number(item.price)*100
        if (item.options) {
            for (const option of item.options) {
                itemPrices[`${item.id}.${option.id}`] = inPence + Number(option.price_modifier? option.price_modifier : 0)*100
            }
        } else {
            itemPrices[item.id] = inPence;
        }
    }
}

async function priceOf(itemId) {
    if (menuSetAt===null || Date.now() - menuSetAt > 1000 * 60 * 60) {
        console.log("Getting menu items")

        const {data, error} = await supabase
            .from('menu_items')
            .select('*')

        if (error) {
            console.error(error);
            return 0;
        } else {
            setMenuItem(data)
        }
    }

    return itemPrices[itemId]
}

async function getMenuItems(req, res) {
    if (!menuSetAt || Date.now() - menuSetAt > 1000 * 60 * 60) {
        console.log("Getting menu items")

        const { data, error } = await supabase
            .from('menu_items')
            .select('*')

        if (error) {
            console.error(error);
            return res.status(400).json({success: false, error: "Failed to get menu items", fullError: error});
        }

        setMenuItem(data)

        return res.status(200).json({success: true, data: data});

    } else {
        console.log("Using cached menu items")

        return res.status(200).json({success: true, data: menuItems});

    }
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
    getMenuItems, getMenuCategories, priceOf
}