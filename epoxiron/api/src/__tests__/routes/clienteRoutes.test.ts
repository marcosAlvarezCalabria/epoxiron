const request = require('supertest');
const app = require('../../app'); // Adjust the path as necessary

describe('Cliente Routes', () => {
    test('GET /clientes should return a list of clients', async () => {
        const response = await request(app).get('/clientes');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /clientes should create a new client', async () => {
        const newClient = { name: 'John Doe', email: 'john@example.com' };
        const response = await request(app).post('/clientes').send(newClient);
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(newClient.name);
    });

    test('GET /clientes/:id should return a client by ID', async () => {
        const response = await request(app).get('/clientes/1'); // Adjust ID as necessary
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
    });

    test('PUT /clientes/:id should update a client', async () => {
        const updatedClient = { name: 'Jane Doe' };
        const response = await request(app).put('/clientes/1').send(updatedClient); // Adjust ID as necessary
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(updatedClient.name);
    });

    test('DELETE /clientes/:id should delete a client', async () => {
        const response = await request(app).delete('/clientes/1'); // Adjust ID as necessary
        expect(response.statusCode).toBe(204);
    });
});