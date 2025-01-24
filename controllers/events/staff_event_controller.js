// Store connected clients
let staffClients = []

async function receiveStaffConnection(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const clientID = Date.now()
    staffClients.push({id: clientID, res})

    console.log(`Staff app connected: ${clientID}`);

    req.on('close', () => {
        console.log(`Staff app disconnected: ${clientID}`);
        staffClients = staffClients.filter(staff => staff.id !== clientID);
    })
}

// Function to send events to clients
const sendEventToStaff = (event) => {
    staffClients.forEach(client => {
        console.log(`Sending event data: ${JSON.stringify(event)}\n\n`)
        client.res.write(`data: ${JSON.stringify(event)}\n\n`);
    });
};

module.exports = {
    receiveStaffConnection, sendEventToStaff
}
