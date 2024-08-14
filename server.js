const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let tickets = [];

// Получить все тикеты
app.get('/tickets', (req, res) => {
    res.status(200).json(tickets.map(({ id, name, status, created }) => ({ id, name, status, created })));
});

// Получить тикет по ID
app.get('/tickets/:id', (req, res) => {
    const ticket = tickets.find(ticket => ticket.id === req.params.id);
    if (ticket) {
        res.status(200).json(ticket);
    } else {
        res.status(404).json({ error: 'Ticket not found' });
    }
});

// Создать новый тикет
app.post('/tickets', (req, res) => {
    const { name, description, status } = req.body;
    const newTicket = {
        id: uuidv4(),
        name,
        description,
        status: Boolean(status),
        created: Date.now(),
    };
    tickets.push(newTicket);
    res.status(201).json(newTicket);
});

// Обновить тикет по ID
app.put('/tickets/:id', (req, res) => {
    const { name, description, status } = req.body;
    const ticket = tickets.find(ticket => ticket.id === req.params.id);
    if (ticket) {
        ticket.name = name;
        ticket.description = description;
        ticket.status = Boolean(status);
        res.status(200).json(ticket);
    } else {
        res.status(404).json({ error: 'Ticket not found' });
    }
});

// Удалить тикет по ID
app.delete('/tickets/:id', (req, res) => {
    const { id } = req.params;
    tickets = tickets.filter(ticket => ticket.id !== id);
    res.status(204).send();
});

// Запуск сервера
const PORT = process.env.PORT || 8080; //изменил для генерации порта в рэйлуэй
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}, HELLO WORLD!`);
});