const supabase = require('../supabaseClient.js');

async function getCustomer(req, res) {
    const { customer_uuid } = req.params;

    if (!customer_uuid) {
        return res.status(400).send({error: 'No customer id provided'});
    }

    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', customer_uuid)
        .single()

    if (error) {
        console.error(error);
        return res.status(400).json({error: "Failed to get customer address", fullError: error});
    }

    console.log(data)
    return res.status(200).json(data);
}

async function updateCustomerDetails(req, res) {

    const { customer_id, line1, line2, town, postcode } = req.body;

    const { data, error } = await supabase
        .from('customers')
        .update({
            customer_id,
            line1,
            line2,
            town,
            postcode
        })

    if (error) {
        console.error(error);
        return res.status(400).json({error: "Failed to update customer details", fullError: error});
    }

    return res.status(200).json(data);
}

module.exports = {
    getCustomer, updateCustomerDetails
}