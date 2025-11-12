const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const { priceOf } = require('./menu')
const supabase = require("../supabaseClient");

const connectedAccountID = process.env.STRIPE_CONNECTED_ACCOUNT_ID

async function checkout(req, res) {

    const { stripe_id, items, delivery } = req.body

    const calculateAmount = async (items) => {
        let total = 0
        for (const item of items) {
            total += await priceOf(item.id)
        }
        return total
    }

    const subtotal = await calculateAmount(items)
    const service_fee = 50
    const delivery_fee = delivery ? 200 : 0

    const amount = subtotal + delivery_fee + service_fee
    const app_fee = Math.round(amount * 0.1)

    const ephemeralKey = await stripe.ephemeralKeys.create(
        {customer: stripe_id},
        {apiVersion: '2025-06-30.basil'}
    )

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'gbp',
        customer: stripe_id,
        transfer_data: {
            destination: connectedAccountID,
        },
        application_fee_amount: app_fee,
        setup_future_usage: 'on_session',
    })

    return res.json({
        success: true,
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    })

}

async function customerSignUp(req, res) {

    console.log('customer sign up', req.body)
    const { user_id, email, firstName, lastName } = req.body;

    try {
        const customer = await stripe.customers.create({
            email,
            name: `${firstName} ${lastName}`
        });

        const { data, error } = await supabase
            .from('customers')
            .update({
                stripe_id: customer.id
            })
            .eq('user_id', user_id)
            .select('*')
            .single()

        if (error) {
            console.error(error);
            return res.status(400).json({error: "Failed to create customer details", fullError: error});
        }

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error(error);

        return res.status(400).json({
            'success': false, error: "Failed to create customer", fullError: error});
    }

}

async function getKeys(req, res) {
    return res.json({
        success: true,
        data: {
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
        }
    })
}

module.exports = {
    checkout, getKeys, customerSignUp
}