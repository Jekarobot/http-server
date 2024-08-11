const http = require('http');
const { v4: uuidv4 } = require('uuid');

let tickets = [];

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const method = url.searchParams.get('method');
    const id = url.searchParams.get('id');

    if (method === 'allTickets') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tickets.map(({ id, name, status, created }) => ({ id, name, status, created}))));
    } else if (method === 'ticketById' && id) {
        const ticket = tickets.find(ticket => ticket.id === id);
        if (ticket) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(ticket));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Ticket not found' }));
        }
    } else if (method === 'createTicket') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, description, status } = JSON.parse(body);
            const newTicket = {
                id: uuidv4(),
                name,
                description,
                status: Boolean(status),
                created: Date.now(),
            };
            tickets.push(newTicket);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newTicket));
        });
    } else if (method === 'updateById' && id) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, description, status } = JSON.parse(body);
            const ticket = tickets.find(ticket => ticket.id === id);
            if (ticket) {
                ticket.name = name;
                ticket.description = description;
                ticket.status = Boolean(status);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(ticket));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Ticket not found' }));
            }
        });
    } else if (method === 'deleteById' && id) {
        tickets = tickets.filter(ticket => ticket.id !== id);
        res.writeHead(204);
        res.end();
    } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request' }));
    }
});

const PORT = 7070;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})