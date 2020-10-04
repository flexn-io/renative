// / <reference types="cypress" />

context('Change Background', () => {
    beforeEach(() => {
        cy.visit('http://0.0.0.0:8180');
    });

    it('cy.go() - go back or forward in the browser\'s history', () => {
        cy.get('[data-testid=try-me-button]').click();
    });
});
