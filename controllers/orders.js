const supabase = require('../supabaseClient.js')
const { sendEventToStaff } = require("./events/staff_event_controller");
const {sendEventToCustomer} = require("./events/customer_event_controller");

async function getAllOrders(req, res) {

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch orders', fullError: error });
    }

    return res.status(200).json(data);
}

async function getOrderById(req, res) {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id);

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch orders', fullError: error });
    }

    if (data.length === 0) {
        return res.status(500).json({error: `No order found with id ${id}`});
    }

    return res.status(200).json(data[0]);
}

async function getOrdersFromDate(req, res) {
    const { date } = req.params;

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', date);

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch orders', fullError: error });
    }

    if (data.length === 0) {
        return res.status(500).json({error: `No orders found from date: ${date}`});
    }

    return res.status(200).json(data);
}

async function updateOrderStatus(req, res) {
    const { id } = req.params;
    const { customerId, status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Missing required field: status' });
    } else if (!customerId) {
        return res.status(400).json({ error: 'Missing required field: customerId' });
    }

    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update order status', fullError: error });
    }

    res.status(200).json({ message: 'Order status updated successfully', order: data[0] });

    sendEventToCustomer(customerId, {type:"ORDER_STATUS_CHANGE", newStatus: status});
}

async function deleteOrder(req, res) {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to delete order' });
    }
    console.error(`Order ${id} deleted successfully`);

    return res.status(200).json({ message: 'Order deleted successfully' });
}

async function addOrder(req, res) {

    const { customer_name, items, total_price, is_delivery, target_time, payment_method } = req.body;

    if (!customer_name)
        return res.status(400).json({ error: 'Missing required fields: customer_name' });
    if (!items)
        return res.status(400).json({ error: 'Missing required fields: items' });
    if (!total_price)
        return res.status(400).json({ error: 'Missing required fields: total_price' });
    if (is_delivery == null)
        return res.status(400).json({ error: 'Missing required fields: is_delivery' });
    if (!target_time)
        return res.status(400).json({ error: 'Missing required fields: target_time' });
    if (!payment_method)
        return res.status(400).json({ error: 'Missing required fields: payment_method' });

    const { data, error } = await supabase
        .from('orders')
        .insert({
            customer_name,
            items,
            total_price,
            is_delivery,
            status: 'Pending',
            payment_method,
            target_time
        });

    if (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Failed to create order' });
    }

    console.log("Order created successfully")
    res.status(200).json({ success: true, message: 'Order created successfully', order: data });

    sendEventToStaff({type: "NEW_ORDER" })
}

module.exports = {
    getAllOrders, addOrder, getOrderById, getOrdersFromDate, updateOrderStatus, deleteOrder
}