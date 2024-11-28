describe('Reqres API Automation', () => {
    const baseUrl = 'https://reqres.in/api';

    // Test GET: List Users
    it('GET - List Users', () => {
        cy.request('GET', `${baseUrl}/users?page=2`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.have.length.above(0);
            expect(response.body.page).to.eq(2);
        });
    });

    // Test GET: Single User
    it('GET - Single User', () => {
        cy.request('GET', `${baseUrl}/users/2`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.id).to.eq(2);
            expect(response.body.data.email).to.exist;
        });
    });

    // Test POST: Create User
    it('POST - Create User', () => {
        cy.request('POST', `${baseUrl}/users`, {
            name: 'John Doe',
            job: 'Software Developer',
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('name', 'John Doe');
            expect(response.body).to.have.property('job', 'Software Developer');
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('createdAt');
        });
    });

    // Test PUT: Update User
    it('PUT - Update User', () => {
        cy.request('PUT', `${baseUrl}/users/2`, {
            name: 'John Doe',
            job: 'Manager',
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('name', 'John Doe');
            expect(response.body).to.have.property('job', 'Manager');
            expect(response.body).to.have.property('updatedAt');
        });
    });

    // Test DELETE: Delete User
    it('DELETE - Delete User', () => {
        cy.request('DELETE', `${baseUrl}/users/2`).then((response) => {
            expect(response.status).to.eq(204); // No content
        });
    });

    // Test GET: Resource List
    it('GET - Resource List', () => {
        cy.request('GET', `${baseUrl}/unknown`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.have.length.above(0);
        });
    });

    // Test GET: Single Resource
    it('GET - Single Resource', () => {
        cy.request('GET', `${baseUrl}/unknown/2`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.id).to.eq(2);
            expect(response.body.data.name).to.exist;
        });
    });

    // Test POST: Register (Successful)
    it('POST - Register Successful', () => {
        cy.request('POST', `${baseUrl}/register`, {
            email: 'eve.holt@reqres.in',
            password: 'pistol',
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('token');
        });
    });

    // Test POST: Register (Failed)
    it('POST - Register Failed', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/register`,
            body: { email: 'eve.holt@reqres.in' },
            failOnStatusCode: false, // Allow 400 status codes
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('error', 'Missing password');
        });
    });

    // Test POST: Login (Successful)
    it('POST - Login Successful', () => {
        cy.request('POST', `${baseUrl}/login`, {
            email: 'eve.holt@reqres.in',
            password: 'cityslicka',
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
        });
    });

    // Test POST: Login (Failed)
    it('POST - Login Failed', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/login`,
            body: { email: 'eve.holt@reqres.in' },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('error', 'Missing password');
        });
    });

    // Test GET: Delayed Response
    it('GET - Delayed Response', () => {
        cy.request('GET', `${baseUrl}/users?delay=3`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.have.length.above(0);
        });
    });
});
