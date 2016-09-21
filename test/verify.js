/**
 * Usage: mocha -t 10000 test/verify
 */

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    test = require('selenium-webdriver/testing'),
    fs = require('fs'),
    config = require('../config.json'),
    assert = require('assert'),
    authbrowser = require('../lib/authbrowser');

require('../lib/date');

test.describe('Verify', function() {
  var driver, cookies;

  test.before(function() {
    driver = authbrowser.createDriver('fd');
  });

  test.it('Create verify', function() {
    driver.get('http://192.168.58.235/sign/verify/');
    driver.findElement({css: '[data-test="create-new"]'}).click();

    driver.wait(until.urlContains('?view=form'), 1000);
    driver.wait(until.elementLocated({css: '[name="iekUrlico"]'}), 500);

    driver.findElement({css: '[name="iekUrlico"]'}).sendKeys('ООО «ИЭК ХОЛДИНГ»');
    // driver.findElement({css: '[name="partnerKod"]'}).sendKeys('Электрофф ООО');
    driver.executeScript("$('[name=\"partnerKod\"]').val('7060')");

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");

    driver.findElement({css: '[name="verifyDate"]'}).sendKeys(randDateStr);

    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.sleep(1000);

    driver.executeScript("var retJSVar = {}; \
        retJSVar.text = $('[name=\"VFile\"]').siblings('.js-signform-alert').text(); \
        return retJSVar;").then(
      function(ret) {
        // console.log(ret);
        assert(ret.text == 'Выберите непустой XLSX файл для загрузки!');
      });

    driver.findElement({css: '[name="VFile"]'}).sendKeys(__dirname + '/../files/test.xlsx');
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.wait(until.urlIs('http://192.168.58.235/sign/verify/'), 1000);
  });


  test.after(function() {
    driver.quit();
  });
});