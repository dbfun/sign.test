var webdriver = require('selenium-webdriver'),
  fs = require('fs'),
  config = require('../config.json'),
  until = webdriver.until;

var cookFileName, cookies;


var createDriver = function(loginType) {

  driver = new webdriver.Builder()
      .forBrowser('firefox')
      .build();

  cookFileName = 'var/auth-' + loginType;

  /*try {
    var stat = fs.statSync(cookFileName);
    cookies = JSON.parse(fs.readFileSync(cookFileName));
    driver.get(config.auth.uri);
    for(var i in cookies) {
      driver.manage().addCookie(cookies[i]);
    }
    driver.get(config.login[loginType].uri);
    driver.sleep(500);
  } catch(e) {
    login(config.login[loginType]);
  }*/

  login(config.login[loginType]);

  return driver;
}

function login(user) {
  driver.manage().deleteAllCookies();
  driver.get(user.uri);

  driver.getTitle().then(function(title) {
    if(title == 'Авторизация') {
        console.log('Авторизация...');
        driver.manage().deleteAllCookies();
        driver.get(user.uri);

        driver.findElement({ css: '.authTab [name="USER_LOGIN"]' }).sendKeys(user.user);
        driver.findElement({ css: '.authTab [name="USER_PASSWORD"]'}).sendKeys(user.password);

        driver.findElement({ type: 'submit', name : 'Login'}).click();
        driver.wait(until.titleIs(user.title), 1000);

        driver.manage().getCookies().then(function (cookies) {
          fs.writeFile(cookFileName, JSON.stringify(cookies, null, 2));
        });
    }
  });

}

module.exports.createDriver = createDriver;