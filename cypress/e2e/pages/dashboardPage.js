class DashBoardPage {
    BUZZ_RESPONSE_ALIAS = "buzzResponseAlias"; //  stores the posts information 
                                               //  when the user accesses the buzz page
    // Menu tabs constants
    BUZZ_STRING = "Buzz";
    MY_INFO_STRING = "MyDetails";
    elements = {
        item_hyperlink: (item) => { return cy.get('a[href*=view' + item + ']')}
    }

    verify() {
        cy.url().should('include', 'dashboard/index');
    }

    clickMenuItem(item) {
        cy.intercept('GET', 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/buzz/feed*').as(this.BUZZ_RESPONSE_ALIAS);
        this.elements.item_hyperlink(item).click();
    }
}
const dashboardPage = new DashBoardPage();
export default dashboardPage;