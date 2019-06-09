const newPhone = process.env.PHONE;
const password = process.env.PASS;
const email = process.env.EMAIL;

const loginEmailSelector = 'input[type=email]';
const editButtonSelector = '#pageContainer > div.callForwardingPage > div.featureContent.niebo > ul > li > div > a';
const phoneInputSelector = 'input[type=text]';
const saveButtonSelector = '#cfForward_button';
const passwordInputSelector = 'input[type=password]';
const phoneValueSelector = '#pageContainer > div.callForwardingPage > div.featureContent.niebo > ul > li > div > span.number.semibold > span';
let phoneAlreadySet = false;
module.exports = {
    'Skype login' : function (browser) {
        browser
          .url('https://go.skype.com/myaccount')
          .waitForElementVisible('.placeholderContainer')          
          .setValue(loginEmailSelector, email)
          .click('input[type=submit]')
          .waitForElementVisible(passwordInputSelector)
          .setValue(passwordInputSelector, password)
          .click('input[type=submit]')
          .waitForElementVisible('#activeFeatures')
      },
    'Access call forwarding edit': function (browser) {        
      browser
        .url('https://secure.skype.com/portal/main-page?page=callForwarding')
        .frame('flowFrame')        
    },
    'Verify call forwarding is not the same': function(browser) {
      browser 
        .getText(phoneValueSelector, (result) => {
          console.log('Current phone is ', result.value)
          phoneAlreadySet = result.value === '+54' + newPhone;
        });
    },
    'Update call forwarding': function(browser) {
      if (phoneAlreadySet) return;
      browser
        .waitForElementVisible(editButtonSelector)
        .click(editButtonSelector)       
        .waitForElementVisible(phoneInputSelector)
        .clearValue(phoneInputSelector)
        .setValue(phoneInputSelector, newPhone)
    },
    'Save call forwarding': function(browser) {
      if (phoneAlreadySet) return;
      browser
        .click(saveButtonSelector)
    },
    'Verify call forwarding updated': function(browser) {
      if (phoneAlreadySet) return;
      browser 
        .waitForElementVisible(phoneValueSelector)
        .assert.containsText(phoneValueSelector, newPhone)
    },
    'Logout': function(browser) {
      browser
        .frameParent()
        .url('https://secure.skype.com/portal/logout')
        .waitForElementVisible(loginEmailSelector)
        .end(); 
    },
  };