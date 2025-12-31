let customerClients = {}
// customerID -> array of connections (in-case of access from multiple devices/tabs)

async function receiveCustomerConnection(req, res) {
    const { customerId } = req.params;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    customerClients[customerId] = customerClients[customerId]? [...customerClients[customerId], res] : [res]

    console.log(`Customer ${customerId} connected: ${customerId}`);

    req.on("close", () => {
        console.log(`Customer ${customerId} disconnected: ${customerId}`);
        delete customerClients[customerId];
    });
}

// Function to send events to specific customers
const sendEventToCustomer = (customerId, event) => {
    const clientConnections = customerClients[customerId];

    if (!clientConnections) {
        console.log(`No active connections for customer: ${customerId}`);
        return
    }

    clientConnections.forEach(res => res.write(`data: ${JSON.stringify(event)}\n\n`));
}

module.exports = {
    receiveCustomerConnection, sendEventToCustomer
}