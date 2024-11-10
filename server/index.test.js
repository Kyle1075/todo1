import { expect } from 'chai';
import { assert } from 'chai';
import { initializeTestDb, insertTestUser, getToken } from './helpers/test.js';  // Assuming your helpers are correct
import fetch from 'node-fetch';  // Ensure you're using node-fetch for fetch in Node.js

const base_url = 'http://localhost:3001/';

describe('GET Tasks', () => {
    before(async () => {
        await initializeTestDb(); // Ensures DB is set up before tests run
    });

    it('should return all tasks', async () => {
        const response = await fetch(base_url + '/');
        const data = await response.json();
        console.log('Response data:', data); // For debugging purposes
        expect(response.status).to.equal(200);
        expect(data).to.be.an('array');
    });
});

describe('POST Task', () => {
    it('should post a task', async () => {
        const response = await fetch(base_url + 'create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'description': 'Task from unit test' }),
        });
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id');
    });
});

describe('DELETE Task', () => {
    it('should delete a task', async () => {
        const response = await fetch(base_url + 'delete/1', {
            method: 'DELETE',
        });
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id');
    });
});

describe('POST Register', () => {
    const email = 'register@foo.com';
    const password = 'password123';

    it('should register with valid email and password', async () => {
        const response = await fetch(base_url + '/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'email': email, 'password': password }), // Fix typo here
        });
        const data = await response.json();
        expect(response.status).to.equal(201, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email');
    });
});

describe('POST Login', () => {
    const email = 'login@foo.com';
    const password = 'password123';

    before(async () => {
        await insertTestUser(email, password); // Insert the test user before login test
    });

    it('should login with valid credentials', async () => {
        const response = await fetch(base_url + '/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'email': email, 'password': password }), // Fix typo here
        });
        const data = await response.json();
        expect(response.status).to.equal(200, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email', 'token');
    });
});

describe('POST Task with Authorization', () => {
    const email = 'post@foo.com';
    const password = 'password123';
    let token;

    before(async () => {
        await insertTestUser(email, password); // Insert user before testing task creation
        token = await getToken(email); // Get token after user is inserted
    });

    it('should post a task with valid token', async () => {
        const response = await fetch(base_url + 'create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use Bearer token in Authorization header
            },
            body: JSON.stringify({ 'description': 'Task from unit test' }),
        });
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id');
    });
});
