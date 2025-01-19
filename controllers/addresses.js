const supabase = require('../supabaseClient.js');

async function getCustomerAddress(req, res) {
    const { customer_id } = req.body;

    if (!customer_id) {
        res.status(400).send({error: 'No customer id provided'});
    }

    const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('customer_id', customer_id)

    if (error) {
        console.error(error);
        return res.status(400).json({error: "Failed to get customer address", fullError: error});
    }

    return res.status(200).json(data);
}

async function addCustomerAddress(req, res) {

    const { customer_id, line1, line2, town, postcode } = req.body;

    const { data, error } = await supabase
        .from('addresses')
        .insert({
            customer_id,
            line1,
            line2,
            town,
            postcode
    })

    if (error) {
        console.error(error);
        return res.status(400).json({error: "Failed to add customer address", fullError: error});
    }

    return res.status(200).json(data);
}

module.exports = {
    getCustomerAddress, addCustomerAddress
}