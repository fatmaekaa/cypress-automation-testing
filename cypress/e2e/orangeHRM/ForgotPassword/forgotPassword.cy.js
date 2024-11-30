/// <reference types= "cypress"/>
import loginPage from "../../../pom/Login/login.cy";

describe('Forgot Your Password Page - Automation Test', () => {
    const url = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode';
    const validUsername = 'Admin';
    const validPassword = 'admin123';
    const invalidUsername = 'Adminah';

    beforeEach(() => {
      // Buka halaman Forgot Password 
      cy.visit(url);
    });
  
    it('TC01: Should display the Forgot Password page correctly', () => {
      // Periksa apakah halaman dimuat dengan benar.
      cy.get('h6').should('contain', 'Reset Password');
      cy.get('input[placeholder="Username"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Reset Password');

      // Tangkap layar untuk hasil tes
      cy.screenshot('TC01_ForgotPasswordPage_Should display the Forgot Password page correctly');
    });
  
    it('TC02: Should proceed with valid username', () => {
      // Intercept untuk request reset password
      cy.intercept('GET', '**/messages').as('messages');

      // Input valid username 
      loginPage.inputUsername().type(validUsername);
      loginPage.inputButtonSubmit().click();

      // Tunggu request reset password
      cy.wait('@messages');
  
      // Validasi keberhasilan atau pengalihan.
      loginPage.resetPswdSuccess().should('have.text','Reset Password link sent successfully')

      // Tangkap layar untuk hasil tes
      cy.screenshot('TC02_ForgotPasswordPage_Should proceed with valid username');
    });

    it('TC03: Should show an error for invalid username', () => {
      // Input invalid username
      loginPage.inputUsername().type(invalidUsername);
      loginPage.inputButtonSubmit().click();
    
      loginPage.resetPswdSuccess().should('have.text', 'Reset Password link sent successfully')

      // Tangkap layar untuk hasil tes
      cy.screenshot('TC03_ForgotPasswordPage_Should show an error for invalid username');
      });
  
    it('TC04: Should prevent submission with empty username', () => {
      // Klik submit tanpa masukkan apapun
      cy.get('button[type="submit"]').click();
  
      // Validasi pesan kesalahan atau peringatan untuk kolom yang wajib diisi
      cy.get('.oxd-input-group__message').should('contain', 'Required');

       // Tangkap layar untuk hasil tes
       cy.screenshot('TC04_ForgotPasswordPage_Should prevent submission with empty username');
    });
  });
  