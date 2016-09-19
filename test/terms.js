/**
 * Usage: mocha -t 10000 test/terms
 */

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    test = require('selenium-webdriver/testing'),
    fs = require('fs'),
    config = require('../config.json'),
    assert = require('assert');

test.describe('Terms', function() {
  var driver, cookies;

  test.before(function() {

    driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();

    cookies = JSON.parse(fs.readFileSync(config.login.coord.file));
    driver.get(config.login.coord.uri);
    for(var i in cookies) {
      driver.manage().addCookie(cookies[i]);
    }
    driver.get(config.login.coord.uri);
    driver.sleep(500);

    driver.getTitle().then(function(title) {
      if(title == 'Авторизация') {
          console.log('Авторизация...');
          driver.manage().deleteAllCookies();
          driver.get(config.login.coord.uri);

          driver.findElement({ css: '.authTab [name="USER_LOGIN"]' }).sendKeys(config.login.coord.user);
          driver.findElement({ css: '.authTab [name="USER_PASSWORD"]'}).sendKeys(config.login.coord.password);

          driver.findElement({ type: 'submit', name : 'Login'}).click();
          driver.wait(until.titleIs('Электронная цифровая подпись'), 1000);

          driver.manage().getCookies().then(function (cookies) {
            fs.writeFile(config.login.coord.file, JSON.stringify(cookies, null, 2));
          });
      }
    });
  });

  test.it('Create terms', function() {
    driver.get('http://192.168.58.235/sign/terms/');
    driver.findElement({css: '[data-test="create-new"]'}).click();

    driver.wait(until.urlContains('?view=form'), 1000);
    driver.wait(until.elementLocated({css: '[name="iekUrlico"]'}), 500);

    driver.findElement({css: '[name="iekUrlico"]'}).sendKeys('ООО «ИЭК ХОЛДИНГ»');
    driver.findElement({css: '[name="dppNumber"]'}).sendKeys('И-А/' + Math.floor(Math.random() * 1000));
    driver.findElement({css: '[name="dppDate"]'}).sendKeys('01.01.2016');
    driver.findElement({css: '[name="paymentOrder"]'}).sendKeys('отсрочка оплаты 30 календарных дней');
    driver.findElement({css: '[name="discount_1"]'}).sendKeys( Math.floor(Math.random() * 20) + 10 ); // 33
    driver.findElement({css: '[name="discount_2"]'}).sendKeys( Math.floor(Math.random() * 10)/10 + 0.1 ); // 0.5
    driver.findElement({css: '[name="penalty"]'}).sendKeys( Math.floor(Math.random() * 30) + 10 ); // 36
    driver.findElement({css: '[name="otherConditions"]'}).sendKeys('отсутствуют');

    driver.executeScript("$('[name=\"ipOrUrlico\"]').val('2').trigger('change')");

    driver.findElement({css: '[name="footerIpHeadPosition"]'}).sendKeys('директор');
    driver.findElement({css: '[name="ipFirstName"]'}).sendKeys('Котов');
    driver.findElement({css: '[name="ipSecondName"]'}).sendKeys('Иван');
    driver.findElement({css: '[name="ipLastName"]'}).sendKeys('Михайлович');

    driver.findElement({css: '[name="blankNumber"]'}).sendKeys( Math.floor(Math.random() * 10000) ); // 500
    driver.findElement({css: '[name="ogrnIp"]'}).sendKeys(315392600033691 + Math.floor(Math.random() * 1000000) );
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.sleep(1000);

    driver.executeScript("var retJSVar = {}; \
        retJSVar.text = $('[name=\"blankSeria\"]').siblings('.js-signform-alert').text(); \
        return retJSVar;").then(
      function(ret) {
        // console.log(ret);
        assert(ret.text == 'Введите бланк серия');
      });

    driver.findElement({css: '[name="blankSeria"]'}).sendKeys( Math.floor(Math.random() * 10000) ); // 100
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.wait(until.urlIs('http://192.168.58.235/sign/terms/'), 1000);
  });

  test.it('Edit terms', function() {
    driver.get('http://192.168.58.235/sign/terms/');
    driver.findElement({css: '.js-doc-edit'}).click();
    driver.wait(until.urlContains('?view=edit'), 1000);
    driver.wait(until.elementLocated({css: '.js-signform [type="submit"]'}), 500);

    driver.findElement({css: '[name="discount_1"]'}).clear();
    driver.findElement({css: '[name="discount_1"]'}).sendKeys(Math.floor(Math.random() * 10) + 2);

    driver.sleep(500);
    driver.findElement({css: '.js-signform [type="submit"]'}).click(); // Not working WTF?
    // driver.findElement(By.id('sign-submit')).click();
    driver.wait(until.urlIs('http://192.168.58.235/sign/terms/'), 5000, 'submit');
  });

  test.it('Confirm terms', function() {

    driver.get('http://192.168.58.235/sign/terms/');

    driver.executeScript("$('.js-doc-confirm').first().parentsUntil('.actions').parent().css({'max-height': '500px', '-webkit-transform': 'none', '-webkit-transform-origin': 'none'});");
    driver.sleep(500);
    driver.findElement({css: '.js-doc-confirm'}).click(); // hidden


    driver.switchTo().alert().then(
      function() {
        driver.switchTo().alert().accept();
        driver.sleep(500);
      },
      function() {
        assert(false === 'Должно быть предупреждение alert');
      }
    );


  });


  test.after(function() {
    driver.quit();
  });
});

