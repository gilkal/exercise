# Cypress exercise

## Setup

1) Install the Cucumber Cypress extension:

   `npm install -–save-dev cypress-cucumber-preprocessor`
   
2) Ponit npm's package.json to the exercise folder stracture:

   Locate package.json and add the following lines:

   `  "cypress-cucumber-preprocessor": {
  "nonGlobalStepDefinitions": false,
  "step_definitions": "cypress/e2e/steps" }`

See example_package.json in this repository for reference. 

## Running the tests:

1) Clone this respository
2) cd to the exercise folder
3) `npx cypress open`
4) Choose E2E tests and run sanity.feature

## Exercise comments

1) The solution aims for maintainabilty, scalability and debuggability, balancing them with high quality requirements.
2) Some negative tests were added as a sample, it is possible to add more as required.
3) In some cases the selectors could be conisdered overly complicated and fragile, but these should theoretically be changed easily if unique identifiers are added to the relevant elements.
4) Minimal test cleanup was added, which can be extended when needed.
5) A known test problem: if the number of comments to the first post is more than 9, the test fails because of the way the selector "picks" the array elements (wrong type of sort).
6) Tested on OSX Sequoia + Chrome only.
7) [This video](https://1drv.ms/v/c/48ea15936430ef63/EXsRuQxL9KlOvAqasmUrocEBKYTDVh8CyZlkC0QhdeLEeQ?e=bmXEfS) shows the tests running as well as how to run them.
