export default class loginPage{
    static verifyLoginPage(){
        return cy.get('h5').contains('Loginb');
    }
    static dashboardPage(){
        return cy.get('h6').contains('Dashboard');
    }
    static inputUsername(){
        return cy.get('[name="username"]');
    }
    static inputPassword(){
        return cy.get('[name="password"]');
    }
    static inputButtonSubmit(){
        return cy.get('[type="submit"]');
    }
}