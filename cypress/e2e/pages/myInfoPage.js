class MyInfoPage {
    // aliases
    PERSONAL_INFO_OBJECT_ALIAS = "PersonalInfoResponseAlias"; // to get the actual backend API call
    PERSONAL_INFO_SUFFIX = 'NameExpected';
    FIRST_NAME_ALIAS = 'first' + this.PERSONAL_INFO_SUFFIX; 
    MIDDLE_NAME_ALIAS = 'middle' + this.PERSONAL_INFO_SUFFIX;
    LAST_NAME_ALIAS = 'last' + this.PERSONAL_INFO_SUFFIX;
    
    // other
    NAME_TYPES = ["first", "middle", "last"]; // to be used for the employee name edit boxes

    elements = {
        // assuming the personal name edit boxes are in the format: name={first/middle/last}Name.
        // The possible values for nameType are defined in this.NAME_TYPES
        employeeName_editbox: (nameType) => cy.get('input[name="' + nameType +'Name"]'),  
        submit_button: () => { return cy.get('button[type="submit"]')}
    }
    verify() {
        cy.url().should('include', 'viewPersonalDetails');
    }

    updatePersonalName(nameType, newName) {
        this.elements.employeeName_editbox(nameType).clear();
        this.elements.employeeName_editbox(nameType).type(newName);
    }

    getPersonalInfo(nameType) {
        return this.elements.employeeName_editbox(nameType);
    }

    saveAllInfo() {
        cy.intercept('PUT', 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/personal-details*').as(this.PERSONAL_INFO_OBJECT_ALIAS);
        this.elements.submit_button().click( {multiple: true} );
    }
    
    verifyCorrectPersonalInfoAPIRequest() {
        // If this fails, it means that the UI did not inovke the right API
        cy.wait('@' + this.PERSONAL_INFO_OBJECT_ALIAS); 
        cy.get('@' + this.PERSONAL_INFO_OBJECT_ALIAS).then((personalInfo) => {
            cy.get('@' + this.FIRST_NAME_ALIAS).then((expectedFirstName) => {
                expect(personalInfo["request"]["body"]["firstName"]).to.equal(expectedFirstName);
            });
            cy.get('@' + this.MIDDLE_NAME_ALIAS).then((expectedMiddleName) => {
                expect(personalInfo["request"]["body"]["middleName"]).to.equal(expectedMiddleName);
            });
            cy.get('@' + this.LAST_NAME_ALIAS).then((expectedLastName) => {
                expect(personalInfo["request"]["body"]["lastName"]).to.equal(expectedLastName);
            });
        });

    }
}
const myInfoPage = new MyInfoPage();
export default myInfoPage;