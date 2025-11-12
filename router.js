const express = require('express');
const router = express.Router();

// -- controllers -------------------------------------------------------------------
const orders_controller = require('./controllers/orders.js');
const addresses_controller = require('./controllers/addresses.js');
const menu_controller = require('./controllers/menu.js');
const customers_controller = require('./controllers/customers.js');
const points_controller = require('./controllers/points.js');
const stripe_controller = require('./controllers/stripe.js');
const app_data_controller = require('./controllers/app_data.js');

// event controllers
const staff_event_controller = require('./controllers/events/staff_event_controller.js');
const customer_event_controller = require('./controllers/events/customer_event_controller.js');


// -- Orders Endpoint ---------------------------------------------------------------
router.post('/orders', orders_controller.addOrder);
router.get('/orders', orders_controller.getAllOrders);
router.get('/orders/:id', orders_controller.getOrderById);
router.patch('/orders/:id', orders_controller.updateOrderStatus);
router.delete('/orders/:id', orders_controller.deleteOrder);
router.get('/orders/from/:date', orders_controller.getOrdersFromDate);

router.get("/events/staff", staff_event_controller.receiveStaffConnection);
router.get("/events/customer/:customerId", customer_event_controller.receiveCustomerConnection)

// -- Addresses Endpoint ------------------------------------------------------------
router.get('/addresses/:customer_id', addresses_controller.getCustomerAddress);
router.post('/addresses', addresses_controller.addCustomerAddress);
router.patch('/addresses/:address_id', addresses_controller.updateAddress)

// -- Menu Endpoint ------------------------------------------------------------
router.get('/menu/items', menu_controller.getMenuItems);
router.get('/menu/categories', menu_controller.getMenuCategories);

// -- Customer Endpoint ------------------------------------------------------------
router.get('/customers/:customer_uuid', customers_controller.getCustomer);
router.patch('/customers/:customer_id', customers_controller.updateCustomerDetails);
router.get('/customers/previous-orders/:customer_id', customers_controller.getCustomerPreviousOrders);
router.delete('/customer', customers_controller.deleteCustomer);

// -- Points Endpoint ------------------------------------------------------------
router.get('/points/:customer_id', points_controller.getCustomerPointsTransactions);
router.post('/points', points_controller.newPointsTransaction);

// Stripe Endpoints
router.get('/stripe/keys', stripe_controller.getKeys)
router.post('/stripe/checkout', stripe_controller.checkout)
router.post('/customer-signup', stripe_controller.customerSignUp)

// App Data Endpoint
router.get('/app-data', app_data_controller.getAppData)

module.exports = router;