import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import loginPage from "../pages/loginPage.js";
import dashboardPage from "../pages/dashboardPage.js";
import myInfoPage from "../pages/myInfoPage.js";
import buzzPage from "../pages/buzzPage.js";

// Stats aliases
const BEFORE_LIKE_ALIAS = 'BeforeLikeAlias'; // to calculate the expected likes count
const BEFORE_COMMENT_ALIAS = 'BeforeCommentsAlias'; // to calculate the expected comments count

When("The user logs in using username {string} and password {string}", (username, password) => {
    loginPage.navigateToLogin();
    loginPage.login(username, password);
});

Given("The user logs in", () => {
    loginPage.navigateToLogin();
    loginPage.login(loginPage.DEFAULT_USERNAME, loginPage.DEFAULT_PASSWORD);
    dashboardPage.verify();
})

Then("The user logs in {string}", (loginExpectedResult) => {
    if (loginExpectedResult == "succeeds") {
        dashboardPage.verify();
    }
    else {
        loginPage.verify();
    }
})

When("The user updates their info", () => {
    // Generating random names to update and saving them as aliases for the verification stage.
    const currentDate = new Date();
    const randomString = currentDate.getTime().toString().slice(0, 6);
    cy.wrap("fname" + randomString).as(myInfoPage.FIRST_NAME_ALIAS);
    cy.wrap("mname" + randomString).as(myInfoPage.MIDDLE_NAME_ALIAS);
    cy.wrap("lname" + randomString).as(myInfoPage.LAST_NAME_ALIAS);
    dashboardPage.clickMenuItem(dashboardPage.MY_INFO_STRING);
    myInfoPage.verify();
    myInfoPage.updatePersonalName("first", "fname" + randomString);
    myInfoPage.updatePersonalName("middle", "mname" + randomString);
    myInfoPage.updatePersonalName("last", "lname" + randomString);
    myInfoPage.saveAllInfo();
})

Then("The personal details were saved correctly", () => {
    myInfoPage.verifyCorrectPersonalInfoAPIRequest(myInfoPage.NAME_TYPES);
    // Necessary for the UI to update
    cy.reload();
    // Iterating over the 3 types of names and verifying that their values have been updated, using the aliases.
    myInfoPage.NAME_TYPES.forEach(function(nameType) {
        cy.get("@" + nameType + myInfoPage.PERSONAL_INFO_SUFFIX).then((expectedFirstName) => {
            myInfoPage.elements.employeeName_editbox(nameType)
                               .invoke('val')
                               .should("eq", expectedFirstName)
        })
    })
})
// TODO: cleanup after personal details update
When("The navigates to the buzz page", () => {
    dashboardPage.clickMenuItem(dashboardPage.BUZZ_STRING);
})

Then("The stats are the same as the ones sent by the backend", () => {
    cy.wait('@' + dashboardPage.BUZZ_RESPONSE_ALIAS);
    buzzPage.getFirstPostUICounts();
    // Retreiving the backend stats and comparing them to the UI ones
    cy.get('@' + dashboardPage.BUZZ_RESPONSE_ALIAS).then((buzzFeedResponse) => {
        let backendNumOfLikes = buzzFeedResponse["response"]["body"]["data"][0]["stats"]["numOfLikes"];
        let backendNumOfComments = buzzFeedResponse["response"]["body"]["data"][0]["stats"]["numOfComments"];
        let backendNumOfShares = buzzFeedResponse["response"]["body"]["data"][0]["stats"]["numOfShares"];
        cy.get('@' + buzzPage.NUM_OF_UI_LIKES_ALIAS).then((uiNumLikes) => {
            expect(backendNumOfLikes.toString(), 'The likes count UI was different from the backend')
                  .to.equal(uiNumLikes);
        });
        cy.get('@' + buzzPage.NUM_OF_UI_COMMENTS_ALIAS).then((uiNumComments) => {
            expect(backendNumOfComments.toString(), 'The comments count UI was different from the backend')
                  .to.equal(uiNumComments);
        });
        cy.get('@' + buzzPage.NUM_OF_UI_SHARES_ALIAS).then((uiNumShares) => {
            expect(backendNumOfShares.toString(), 'The shares count UI was different from the backend')
                  .to.equal(uiNumShares);
        });
    });
});

When("The user likes the first post and adds a comment", () => {
    buzzPage.getFirstPostUICounts();
    cy.get('@' + buzzPage.NUM_OF_UI_LIKES_ALIAS).then((likesCountBeforeClick) => {
        cy.wrap(likesCountBeforeClick).as(BEFORE_LIKE_ALIAS);
    })
    cy.get('@' + buzzPage.NUM_OF_UI_COMMENTS_ALIAS).then((commentsCountBeforeClick) => {
        cy.wrap(commentsCountBeforeClick).as(BEFORE_COMMENT_ALIAS);
    })
    buzzPage.likeFirstPostLike();
    buzzPage.commentFirstPost();
    // Necessary for the UI to update
    cy.reload();
})

Then("The first post's likes and comments count changes accordingly", () => {
    buzzPage.getFirstPostUICounts(); 
    cy.get('@' + BEFORE_LIKE_ALIAS).then((likesCountBeforeClick) => {
        cy.get('@' + BEFORE_COMMENT_ALIAS).then((commentsCountBeforeComment) => {
            cy.get('@' + buzzPage.NUM_OF_UI_LIKES_ALIAS).then((likesCountAfterClick) => {
                // Since there's only one user, clicking the likes will always be either 1 or 0
                Number(likesCountBeforeClick) ? expect(likesCountAfterClick, 
                                                'The UI like count did not update correctly').to.eq('0') : 
                                                expect(likesCountAfterClick, 
                                                'The UI like count did not update correctly').to.eq('1');
            });
            cy.get('@' + buzzPage.NUM_OF_UI_COMMENTS_ALIAS).then((commentsCountAfterComment) => {
                let expectedCommentsCount = Number(commentsCountBeforeComment) + 1;
                expect(commentsCountAfterComment, 'The UI comment count did not update correctly')
                      .to.eq(expectedCommentsCount.toString());
            });
        })
    });
})

When("The user sets the {string} name to {string}", (nameType, value) => {
    dashboardPage.clickMenuItem(dashboardPage.MY_INFO_STRING);
    myInfoPage.verify();
    let valueToSend;
    (value == "empty") ? valueToSend = " " : valueToSend = value;
    myInfoPage.updatePersonalName(nameType, valueToSend);
    myInfoPage.saveAllInfo();
})

Then("The personal details are not saved", () => {
    // If the alias does not exist, the API was not sent and the details were not updated.
    cy.get('@' + myInfoPage.PERSONAL_INFO_OBJECT_ALIAS).then((personalInfo) => {
        expect(personalInfo, "The UI sent the personal information to the backend with an invalid data")
              .to.eq(null)
    });
})