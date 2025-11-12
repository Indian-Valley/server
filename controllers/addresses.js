const supabase = require('../supabaseClient.js');

async function getCustomerAddress(req, res) {
    const { customer_id } = req.params;

    if (!customer_id) {
        res.status(400).send({success: false, error: 'No customer id provided'});
    }

    const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('customer_id', customer_id)

    if (error) {
        console.error(error);
        return res.status(400).json({success: false, error: "Failed to get customer address", fullError: error});
    }

    return res.status(200).json({success: true, data: data});
}

async function addCustomerAddress(req, res) {

    console.log('adding customer address', req.body)

    const { address_id } = req.params
    const { customer_id, line1, line2, town, postcode, delivery_notes, is_default, label } = req.body;

    if (!address_id)
        return res.status(400).json({ success: false, error: 'Missing required parameter: address_id' });

    const supabase_res = await supabase
        .from('addresses')
        .insert({
            customer_id,
            line1,
            line2,
            town,
            postcode,
            delivery_notes,
            label
        })
        .eq('address_id', address_id)
        .select()
        .single()

    if (supabase_res.error) {
        console.error(supabase_res.error);
        return res.status(400).json({ success:false, error: "Failed to add customer address", fullError: supabase_res.error});
    }


    if (is_default === true) {
        const { data, error } = await supabase
            .from('customers')
            .update({
                default_address: supabase_res.data.id
            })
            .eq('id', customer_id)

        if (error) {
            console.error(error);
            return res.status(400).json({error: "Failed to update customer details", fullError: error});
        }
    }

    return res.status(200).json({
        success: true,
        data:supabase_res.data
    });
}


async function updateAddress(req, res) {

    console.log('updating address', req.body)

    const { line1, line2, town, postcode, delivery_notes, is_default, label } = req.body;

    const supabase_res = await supabase
    .from('addresses')
    .insert({
        line1,
        line2,
        town,
        postcode,
        delivery_notes,
        label
    })
    .select()
    .single()

    if (supabase_res.error) {
        console.error(supabase_res.error);
        return res.status(400).json({
            success: false,
            error: "Failed to add customer address",
            fullError: supabase_res.error
        });
    }


    if (is_default === true) {
        const { data, error } = await supabase
        .from('customers')
        .update({
            default_address: supabase_res.data.id
        })
        .eq('id', customer_id)

        if (error) {
            console.error(error);
            return res.status(400).json({ error: "Failed to update customer details", fullError: error });
        }
    }

    return res.status(200).json({
        success: true,
        data: supabase_res.data
    });
}

async function removeCustomerAddress(req, res) {
    const { address_id } = req.body;

    const { error } = await supabase
        .from('addresses')
        .update({'customer_id': null})
        .eq('address_id', address_id)

    if (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: "Failed to remove customer address", fullError: error });
    }

    return res.status(200).json({ success: true });
}

module.exports = {
    getCustomerAddress, addCustomerAddress, updateAddress, removeCustomerAddress
}