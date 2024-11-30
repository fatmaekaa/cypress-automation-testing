export default class directoryPage{
    static inputEmployeeName(){
        return cy.get('[placeholder="Type for hints..."]');
    }
    static inputButtonSubmitDir(){
        return cy.get('button[type="submit"]');
    }
    static directory(){
        return cy.get('h6').contains('Directory');
    }
}