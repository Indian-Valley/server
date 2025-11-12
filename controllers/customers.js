const supabase = require('../supabaseClient.js');

async function getCustomer(req, res) {

    const { customer_uuid } = req.params;

    if (!customer_uuid) {
        return res.status(400).send({success: false, error: 'No customer id provided'});
    }

    console.log('getting customer', customer_uuid)

    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', customer_uuid)
        .single()

    if (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: "Failed to get customer address", fullError: error});
    }

    return res.status(200).json({ success: true, data });
}

async function updateCustomerDetails(req, res) {

    const { customer_id } = req.params;
    const { first_names, last_name, tel } = req.body;

    const { data, error } = await supabase
        .from('customers')
        .update({
            first_names,
            last_name,
            tel
        })
        .eq('id', customer_id)
        .select().single()

    if (error) {
        console.error(error);
        return res.status(400).json({error: "Failed to update customer details", fullError: error});
    }

    return res.status(200).json({success: true, data});
}

async function getCustomerPreviousOrders(req, res) {
    const { customer_id } = req.params;

    if (!customer_id) {
        return res.status(400).send({error: 'No customer id provided'});
    }

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customer_id)

    if (error) {
        console.error(error);
        return res.status(400).json({ success: false, error: "Failed to get customer orders", fullError: error});
    }

    return res.status(200).json(data);
}

async function deleteCustomer(req, res) {
    const { user_id } = req.body;

    console.log('deleting customer', user_id)

    const resCustomerTable = await supabase
        .from('customers')
        .update({user_id: null})
        .eq('user_id', user_id);

    if (resCustomerTable?.error) {
        console.error('error clearing user_id from customer table', resCustomerTable?.error);
        return res.status(400).json({ error: "Failed to delete customer", fullError: resCustomerTable?.error});
    }

    const { data, error } = await supabase.auth.admin.deleteUser(user_id);

    if (error) {
        console.error('error deleting user from auth table', error);
        return res.status(400).json({ error: "Failed to delete customer", fullError: error});
    }

    return res.status(200).json({ message: "Customer deleted successfully" });

}

module.exports = {
    getCustomer, updateCustomerDetails, getCustomerPreviousOrders, deleteCustomer
}