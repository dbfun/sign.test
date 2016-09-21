var webdriver = require('selenium-webdriver'),
  fs = require('fs'),
  config = require('../config.json');


var createDriver = function(loginType) {

  driver = new webdriver.Builder()
      .forBrowser('firefox')
      .build();

  cookies = JSON.parse(fs.readFileSync(config.login[loginType].file));
  driver.get(config.login[loginType].uri);
  for(var i in cookies) {
    driver.manage().addCookie(cookies[i]);
  }
  driver.get(config.login[loginType].uri);
  driver.sleep(500);

  driver.getTitle().then(function(title) {
    if(title == 'Авторизация') {
        console.log('Авторизация...');
        driver.manage().deleteAllCookies();
        driver.get(config.login[loginType].uri);

        driver.findElement({ css: '.authTab [name="USER_LOGIN"]' }).sendKeys(config.login[loginType].user);
        driver.findElement({ css: '.authTab [name="USER_PASSWORD"]'}).sendKeys(config.login[loginType].password);

        driver.findElement({ type: 'submit', name : 'Login'}).click();
        driver.wait(until.titleIs(config.login[loginType].title), 1000);

        driver.manage().getCookies().then(function (cookies) {
          fs.writeFile(config.login[loginType].file, JSON.stringify(cookies, null, 2));
        });
    }
  });
  return driver;
}

module.exports.createDriver = createDriver;