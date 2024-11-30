/// <reference types= "cypress"/>
import loginPage from "../../pom/Login/login.cy";

describe('OrangeHRM Login Tests', () => {
    const url = 'https://opensource-demo.orangehrmlive.com/';
    const validUsername = 'Admin';
    const validPassword = 'admin123';
    const invalidPassword = 'wrongpassword';
  
    beforeEach(() => {
      cy.visit(url); // Mengakses halaman OrangeHRM
    });
  
    it('TC01: Should login with valid username and password', () => {
      loginPage.verifyLoginPage().should('have.text','Login')
      loginPage.inputUsername().type(validUsername); // Input username
      loginPage.inputPassword().type(validPassword); // Input password

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

      loginPage.dashboardPage().should('have.text','Dashboard') // Verifikasi berhasil login
  
      // Tangkap layar untuk hasil tes
      cy.screenshot('TC01_LoginPage_ValidLogin');
    });
  
    it('TC02: Should not login with invalid password', () => {
      loginPage.inputUsername().type(validUsername);
      loginPage.inputPassword().type(invalidPassword);
      loginPage.inputButtonSubmit().click();
  
      cy.get('[class="oxd-text oxd-text--p oxd-alert-content-text"]')
        .should('be.visible')  // Memastikan elemen terlihat
        .should('have.text', 'Invalid credentials');  // Memastikan teks sesuai
  
      // Tangkap layar untuk hasil tes
      cy.screenshot('TC02_LoginPage_InvalidPassword');
    });
  
    it('TC03: Should not login with empty username', () => {
      loginPage.inputPassword().type(validPassword);
      loginPage.inputButtonSubmit().click();
  
      cy.get('[class="oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message"]')
        .should('be.visible')
        .and('have.text', 'Required');
  
      // Tangkap layar untuk hasil tes
      cy.screenshot('TC03_LoginPage_EmptyUsername');
    });
  
    it('TC04: Should not login with empty password', () => {
      loginPage.inputUsername().type(validUsername);
      loginPage.inputButtonSubmit().click();
  
      cy.get('[class="oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message"]')
        .should('be.visible')
        .and('have.text', 'Required');
  
      // Tangkap layar untuk hasil tes
      cy.screenshot('TC04_LoginPage_EmptyPassword');
    });
  
    it('TC05: Should not login with empty username and password', () => {
        // Pastikan kedua input kosong
        loginPage.inputUsername().should('have.value', ''); // Verifikasi input username kosong
        loginPage.inputPassword().should('have.value', ''); // Verifikasi input password kosong
        
        // Klik tombol submit
        loginPage.inputButtonSubmit().click();
        
        // Verifikasi pesan error untuk username
        cy.get('[class="oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message"]')
        .should('be.visible')
        .contains('Required'); // Memastikan pesan "Required" muncul, tanpa mempermasalahkan duplikasi teks
    
      // Tangkap layar untuk hasil tes
      cy.screenshot('TC05_LoginPage_EmptyUsernameAndPassword');
    });
  });
  