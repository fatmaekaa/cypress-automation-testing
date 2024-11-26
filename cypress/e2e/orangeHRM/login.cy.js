/// <reference types= "cypress"/>

describe('OrangeHRM Login Tests', () => {
    const url = 'https://opensource-demo.orangehrmlive.com/';
    const validUsername = 'Admin';
    const validPassword = 'admin123';
    const invalidPassword = 'wrongpassword';
  
    beforeEach(() => {
      cy.visit(url); // Mengakses halaman OrangeHRM
    });
  
    it('TC01: Should login with valid username and password', () => {
      cy.get('[name="username"]').type(validUsername); // Input username
      cy.get('[name="password"]').type(validPassword); // Input password

      //Intercept API
      cy.intercept('GET', '**/action-summary').as('actionSummary');
      cy.intercept('GET', '**/time-at-work*').as('timeAtWork');
      cy.intercept('GET', '**/shortcuts').as('shortcuts');
      cy.intercept('GET', '**/feed*').as('feed');
      cy.intercept('GET', '**/leaves*').as('leaves');
      cy.intercept('GET', '**/subunit').as('subunit');
      cy.intercept('GET', '**/location*').as('location');
      cy.intercept('POST', '**/push').as('push');

      cy.get('[type="submit"]').click(); // Klik tombol login
      
      // Tunggu request ke login endpoint
      cy.wait('@actionSummary');
      cy.wait('@timeAtWork');
      cy.wait('@shortcuts');
      cy.wait('@feed');
      cy.wait('@leaves');
      cy.wait('@subunit');
      cy.wait('@location');
      cy.wait('@push');

      cy.get('h6').contains('Dashboard').should('have.text','Dashboard') // Verifikasi berhasil login
  
      // Tangkap layar untuk hasil tes
      cy.screenshot('TC01_ValidLogin');
    });
  
    it('TC02: Should not login with invalid password', () => {
      cy.get('[name="username"]').type(validUsername);
      cy.get('[name="password"]').type(invalidPassword);
      cy.get('[type="submit"]').click();
  
      cy.get('[class="oxd-text oxd-text--p oxd-alert-content-text"]')
        .should('be.visible')  // Memastikan elemen terlihat
        .should('have.text', 'Invalid credentials');  // Memastikan teks sesuai
  
      // Tangkap layar untuk hasil tes
      cy.screenshot('TC02_InvalidPassword');
    });
  
    it('TC03: Should not login with empty username', () => {
      cy.get('[name="password"]').type(validPassword);
      cy.get('[type="submit"]').click();
  
      cy.get('[class="oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message"]')
        .should('be.visible')
        .and('have.text', 'Required');
  
      // Tangkap layar untuk hasil tes
      cy.screenshot('TC03_EmptyUsername');
    });
  
    it('TC04: Should not login with empty password', () => {
      cy.get('[name="username"]').type(validUsername);
      cy.get('[type="submit"]').click();
  
      cy.get('[class="oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message"]')
        .should('be.visible')
        .and('have.text', 'Required');
  
      // Tangkap layar untuk hasil tes
      cy.screenshot('TC04_EmptyPassword');
    });
  
    it('TC05: Should not login with empty username and password', () => {
        // Pastikan kedua input kosong
        cy.get('[name="username"]').should('have.value', ''); // Verifikasi input username kosong
        cy.get('[name="password"]').should('have.value', ''); // Verifikasi input password kosong
        
        // Klik tombol submit
        cy.get('[type="submit"]').click();
        
        // Verifikasi pesan error untuk username
        cy.get('[class="oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message"]')
        .should('be.visible')
        .contains('Required'); // Memastikan pesan "Required" muncul, tanpa mempermasalahkan duplikasi teks
    
      // Tangkap layar untuk hasil tes
      cy.screenshot('TC05_EmptyUsernameAndPassword');
    });

    it('TC06: Should verify "Forgot Your Password" works correctly', () => {
        // Intercept untuk request reset password
        cy.intercept('GET', '**/messages').as('messages');

        // Klik link "Forgot your password?"
        cy.contains('Forgot your password?').click();
    
        // Pastikan diarahkan ke halaman reset password
        cy.url().should('include', '/auth/requestPasswordResetCode');
    
        // Masukkan username/email valid
        cy.get('[name="username"]').type(validUsername);
    
        // Klik tombol "Reset Password"
        cy.get('[type="submit"]').click();

        // Tunggu request reset password
        cy.wait('@messages');
    
        // Verifikasi pesan konfirmasi muncul
        cy.get('[class="orangehrm-card-container"]')
        .should('be.visible')
        .and('contain.text', 'Reset Password link sent successfully');
        
        // Tangkap layar untuk hasil tes
        cy.screenshot('TC06_ForgotYourPassword');
      });
  });
  