/// <reference types= "cypress"/>
import directoryPage from "../../../pom/Directory/directory.cy";
import loginPage from "../../../pom/Login/login.cy";

describe('Directory Page - Automation Test', () => {
    const url = 'https://opensource-demo.orangehrmlive.com';
    const username = 'Admin';
    const password = 'admin123';
  
    beforeEach(() => {
      // Login ke aplikasi
      cy.visit(`${url}/web/index.php/auth/login`);
      loginPage.inputUsername().type(username);
      loginPage.inputPassword().type(password);
      loginPage.inputButtonSubmit().click();
  
      // Navigasi ke halaman Directory
      cy.url().should('include', '/dashboard/index');
      cy.visit(`${url}/web/index.php/directory/viewDirectory`);
    });
  
    it('TC01: Should display the Directory page correctly', () => {
      // Verifikasi elemen penting di halaman
      directoryPage.directory().should('contain', 'Directory'); // Memastikan judul halaman
      cy.get('input[placeholder="Type for hints..."]').should('be.visible'); // Input pencarian
      cy.get('button[type="submit"]').should('be.visible').and('contain', 'Search');

       // Tangkap layar untuk hasil tes
       cy.screenshot('TC01_DirectoryPage_Should display the Directory page correctly');
    });
  
    it('TC02: Should allow searching for an employee', () => {
      const employeeName = 'Peter Mac Anderson'; // Nama contoh yang tersedia di demo
      
      cy.intercept('GET', '**/messages').as('messages');
      cy.intercept('GET', '**/employees*').as('employees');

      // Masukkan nama karyawan
      directoryPage.inputEmployeeName().type(employeeName);
      directoryPage.inputButtonSubmitDir().click();
      
      cy.wait('@messages');
      cy.wait('@employees');

     // Verifikasi hasil pencarian
      cy.get('[class="oxd-text oxd-text--span"]').should('be.visible').then(() => {
        cy.log('Table is visible, checking for text');
      });
      cy.contains('[class="orangehrm-container"]', employeeName).should('be.visible');

      // Tangkap layar untuk hasil tes
      cy.screenshot('TC02_DirectoryPage_Should allow searching for an employee');
    }); 
  
    it('TC03: Should show no results for a non-existent employee', () => {
      const invalidName = 'Fatma Eka';
  
      // Masukkan nama yang tidak ada
      cy.get('input[placeholder="Type for hints..."]').type(invalidName);
      cy.get('button[type="submit"]').click();
  
      // Verifikasi hasil
      cy.get('.oxd-text').should('contain', 'No Records Found');

      // Tangkap layar untuk hasil tes
      cy.screenshot('TC03_DirectoryPage_Should show no results for a non-existent employee');
    });
  
    it('TC04: Should allow filtering by job title', () => {
      const jobTitle = 'Chief Financial Officer';
  
      // Pilih filter Job Title
      cy.get('[class="oxd-select-text-input"]').first().click(); // Klik dropdown pertama (Job Title)
      cy.get('.oxd-select-dropdown').contains(jobTitle).click();
  
      // Klik tombol Search
      cy.get('button[type="submit"]').click();
  
      // Verifikasi hasil
      cy.get('[class="orangehrm-container"]')
      .should('be.visible') // Tabel hasil pencarian
      .should('contain', jobTitle);

      // Tangkap layar untuk hasil tes
      cy.screenshot('TC04_DirectoryPage_Should allow filtering by job title');
    });
  
    it('TC05: Should clear filters when reset is clicked', () => {
      const employeeName = 'Linda Anderson';
  
      // Isi filter dan klik Search
      cy.get('input[placeholder="Type for hints..."]').type(employeeName);
      cy.get('button[type="submit"]').click();
  
      // Klik tombol Reset
      cy.get('button[type="reset"]').click();
  
      // Verifikasi input dan tabel kosong
      cy.get('input[placeholder="Type for hints..."]').should('have.value', '');
      cy.get('.oxd-table-row').should('not.exist');
      
      // Tangkap layar untuk hasil tes
      cy.screenshot('TC05_DirectoryPage_Should clear filters when reset is clicked');
    });
  });
  