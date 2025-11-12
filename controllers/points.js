const supabase = require('../supabaseClient.js');

async function getCustomerPointsTransactions(req, res) {
    const { customer_id } = req.params;

    const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('customer_id', customer_id)

    if (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            error: "Failed to get customer points transactions",
            fullError: error
        });
    }

    return res.status(200).json({success: true, data: data});
}

async function newPointsTransaction(req, res) {
    const { customer_id, amount, current_balance, description } = req.body;

    const balance_after = current_balance - amount;

    const { data, error } = await supabase
        .from('points_transactions')
        .insert({
            customer_id,
            amount,
            balance_after,
            description
        })
        .select('*')
        .single()

    if (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            error: "Failed to create customer points transaction",
            fullError: error
        });
    }

    const { data: customer, error: customerError } = await supabase
        .from('customers')
        .update({ points_balance: balance_after })
        .eq('id', customer_id)

    if (customerError) {
        console.error(customerError);
        return res.status(400).json({
            success: false,
            error: "Failed to update customer points balance",
            fullError: customerError
        });
    }

    return res.status(200).json({success: true});
}
module.exports = {
    getCustomerPointsTransactions, newPointsTransaction
}