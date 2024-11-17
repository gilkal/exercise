class BuzzPage {
    NUM_OF_UI_LIKES_ALIAS = 'NumOfUiLikesAlias' // to calculate the UI likes count
    NUM_OF_UI_COMMENTS_ALIAS = 'NumOfUiCommentsAlias' // to calculate the UI comments count 
    NUM_OF_UI_SHARES_ALIAS = 'NumOfUiSharesAlias' // to calculate the UI shared count
    
    elements = {
        firstPostStats_object: () => { return cy.get('[class="orangehrm-buzz-stats"]', { timeout: 10000 })
                                                .first()
                                                .find('[class="orangehrm-buzz-stats-row"]')
                                                .find('p')
                                     },
        firstPostLike_button: () => { return cy.get('[class=orangehrm-buzz-post-actions]')
                                            .first()
                                            .find('[id=heart-svg]')
                                },
        firstPostComment_button: () => { return cy.get('[class=orangehrm-buzz-post-actions]')
                                                .find('[type=button]')
                                                .first()
                                       },
        firstPostComment_editbox: () => { return cy.get('input[placeholder="Write your comment..."]')
                                                .first()
                                        }   
    }

    verify() {
        cy.url().should('include', 'buzz/viewBuzz');
    }

    getFirstPostUICounts() {
        this.elements.firstPostStats_object().then((firstPostStats) => {
            let stats = firstPostStats.text();
            let nums = stats.match(/[0-9]/g);
            cy.wrap(nums[0]).as(this.NUM_OF_UI_LIKES_ALIAS);
            cy.wrap(nums[1]).as(this.NUM_OF_UI_COMMENTS_ALIAS);
            cy.wrap(nums[2]).as(this.NUM_OF_UI_SHARES_ALIAS);
        })
    }

    likeFirstPostLike() {
        this.elements.firstPostLike_button().click();
    }
    
    commentFirstPost() {
        this.elements.firstPostComment_button().click();
        this.elements.firstPostComment_editbox().type("Nice!"); 
        this.elements.firstPostComment_editbox().type('{enter}');
        this.elements.firstPostComment_button().click();                                            
    }

}
const buzzPage = new BuzzPage();
export default buzzPage;