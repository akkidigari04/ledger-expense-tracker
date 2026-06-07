const request = require('supertest');

// Use an in-memory DB for tests
process.env.DB_PATH = ':memory:';
process.env.NODE_ENV = 'test';

const app = require('../app');

describe('Health check', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Expenses API', () => {
  let createdId;

  it('GET /api/expenses returns empty array initially', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('POST /api/expenses creates an expense', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: 250.50,
      category: 'Food',
      date: '2024-01-15',
      note: 'Lunch',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.amount).toBe(250.50);
    expect(res.body.data.category).toBe('Food');
    createdId = res.body.data.id;
  });

  it('POST /api/expenses rejects negative amount', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: -10,
      category: 'Food',
      date: '2024-01-15',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('POST /api/expenses rejects future date', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: 100,
      category: 'Food',
      date: '2099-01-01',
    });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/expenses rejects invalid category', async () => {
    const res = await request(app).post('/api/expenses').send({
      amount: 100,
      category: 'InvalidCat',
      date: '2024-01-15',
    });
    expect(res.statusCode).toBe(400);
  });

  it('GET /api/expenses/:id returns the created expense', async () => {
    const res = await request(app).get(`/api/expenses/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(createdId);
  });

  it('PUT /api/expenses/:id updates the expense', async () => {
    const res = await request(app).put(`/api/expenses/${createdId}`).send({
      amount: 300,
      note: 'Updated note',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.amount).toBe(300);
    expect(res.body.data.note).toBe('Updated note');
  });

  it('GET /api/expenses/summary returns summary', async () => {
    const res = await request(app).get('/api/expenses/summary');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('total_month');
    expect(res.body.data).toHaveProperty('by_category');
    expect(res.body.data).toHaveProperty('highest_expense');
  });

  it('DELETE /api/expenses/:id deletes the expense', async () => {
    const res = await request(app).delete(`/api/expenses/${createdId}`);
    expect(res.statusCode).toBe(204);
  });

  it('GET /api/expenses/:id returns 404 after deletion', async () => {
    const res = await request(app).get(`/api/expenses/${createdId}`);
    expect(res.statusCode).toBe(404);
  });
});

describe('Budgets API', () => {
  it('GET /api/budgets returns array', async () => {
    const res = await request(app).get('/api/budgets');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/budgets creates/updates a budget', async () => {
    const res = await request(app).post('/api/budgets').send({
      category: 'Food',
      amount: 5000,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.amount).toBe(5000);
  });

  it('DELETE /api/budgets/:category deletes a budget', async () => {
    const res = await request(app).delete('/api/budgets/Food');
    expect(res.statusCode).toBe(204);
  });
});
