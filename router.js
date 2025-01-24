const express = require('express');
const router = express.Router();

// -- controllers -------------------------------------------------------------------
const orders_controller = require('./controllers/orders.js');
const addresses_controller = require('./controllers/addresses.js');
const customers_controller = require('./controllers/customers.js');

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

// -- Customer Endpoint ------------------------------------------------------------
router.get('/customers/:customer_uuid', customers_controller.getCustomer);
router.patch('/customers/:customer_uuid', customers_controller.updateCustomerDetails);

module.exports = router;