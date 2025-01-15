const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Test Route
app.get('/', (req, res) => {
    res.send('Restaurant server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/orders', async (req, res) => {
    const { customer_name, items, total_price, is_delivery, target_time, payment_method } = req.body;

    if (!customer_name) return res.status(400).json({ error: 'Missing required fields: customer_name' });
    if (!items) return res.status(400).json({ error: 'Missing required fields: items' });
    if (!total_price) return res.status(400).json({ error: 'Missing required fields: total_price' });
    if (is_delivery == null) return res.status(400).json({ error: 'Missing required fields: is_delivery' });
    if (!target_time) return res.status(400).json({ error: 'Missing required fields: target_time' });
    if (!payment_method) return res.status(400).json({ error: 'Missing required fields: payment_method' });


    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([{
                customer_name,
                items,
                total_price,
                is_delivery,
                status: 'Pending',
                payment_method,
                target_time
            }]);

        // if (error) throw error;

        res.status(201).json({ message: 'Order created successfully', order: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

app.get('/orders', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

app.patch('/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Missing required field: status' });
    }

    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({ message: 'Order status updated successfully', order: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

app.delete('/orders/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({ message: 'Order deleted successfully', order: data[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
});
