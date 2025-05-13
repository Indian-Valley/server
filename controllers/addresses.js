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

    const { customer_id, line1, line2, town, postcode, delivery_notes, is_default } = req.body;

    if (!customer_id)
        return res.status(400).json({ success: false, error: 'Missing required fields: customer_id' });
    if (!line1)
        return res.status(400).json({ success: false, error: 'Missing required fields: line1' });
    if (!town)
        return res.status(400).json({ success: false, error: 'Missing required fields: town' });
    if (!postcode)
        return res.status(400).json({ success: false, error: 'Missing required fields: postcode' });

    const { data, error } = await supabase
        .from('addresses')
        .insert({
            customer_id,
            line1,
            line2,
            town,
            postcode,
            delivery_notes
        })
        .select()

    if (error) {
        console.error(error);
        return res.status(400).json({ success:false, error: "Failed to add customer address", fullError: error});
    }

    return res.status(200).json({ success: true, data:data});
}

module.exports = {
    getCustomerAddress, addCustomerAddress
}