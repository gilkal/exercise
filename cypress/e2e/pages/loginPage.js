class LoginPage {
    DEFAULT_USERNAME = 'Admin'
    DEFAULT_PASSWORD = 'admin123'

    elements = {
        username_textbox: () => { return cy.get('input[name="username"]') },
        password_textbox: () => { return cy.get('input[name="password"]') },
        submit_button: () => { return cy.get('button[type="submit"]')}
    }

    verify() {
        cy.url().should('include', 'auth/login');
    }

    navigateToLogin() {
       cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    }

    login(username, password) {
        this.elements.username_textbox().type(username);
        this.elements.password_textbox().type(password);
        this.elements.submit_button().click();
    }
}

const loginPage = new LoginPage();
export default loginPage;
