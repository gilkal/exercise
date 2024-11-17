Feature: Sanity tests
 
  Scenario Outline: The user logs into the system
    When The user logs in using username "<username>" and password "<password>"
    Then The user logs in "<expected_result>"
    Examples:  
      | username  | password  | expected_result |
      | Admin     | admin123  | succeeds        |
      | Admin     | admin1234 | fails           |
      | Admin1    | admin123  | fails           |
   

  Scenario: The user info is saved when edited 
    Given The user logs in
    When The user updates their info
    Then The personal details were saved correctly


  Scenario Outline: The user info with invalid values
     Given The user logs in
     When The user sets the "<nameType>" name to "<value>"
     Then The personal details are not saved
     Examples:
     | nameType  | value  |
     | first     | empty  |
     | last      | empty  |


  Scenario: The stats sent from the backend appear correctly in the backend
    Given The user logs in
    When The navigates to the buzz page
    Then The stats are the same as the ones sent by the backend


  Scenario: The stats count changes when interacted with
    Given The user logs in
    And The navigates to the buzz page
    When The user likes the first post and adds a comment
    Then The first post's likes and comments count changes accordingly