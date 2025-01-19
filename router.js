const express = require('express');
const router = express.Router();

// -- controllers -------------------------------------------------------------------
const orders_controller = require('./controllers/orders.js');
const addresses_controller = require('./controllers/addresses.js');


// -- Orders Endpoint ---------------------------------------------------------------
router.post('/orders', orders_controller.addOrder);
router.get('/orders', orders_controller.getAllOrders);
router.get('/orders/:id', orders_controller.getOrderById);
router.patch('/orders/:id', orders_controller.updateOrderStatus);
router.delete('/orders/:id', orders_controller.deleteOrder);
router.get('/orders-from', orders_controller.getOrdersFromDate);

// -- Addresses Endpoint ------------------------------------------------------------
router.get('/addresses', addresses_controller.getCustomerAddress);
router.post('/addresses', addresses_controller.addCustomerAddress);

module.exports = router;