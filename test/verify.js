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
  var driver;

  test.before(function() {
    driver = authbrowser.createDriver('fd');
  });

  test.it('Create verify', function() {
    driver.get('http://192.168.58.235/sign/verify/');
    driver.wait(until.elementLocated({css: '[data-test="create-new"]'}), 500);
    driver.findElement({css: '[data-test="create-new"]'}).click();

    driver.wait(until.urlContains('?view=form'), 1000);
    driver.wait(until.elementLocated({css: '[name="iekUrlico"]'}), 500);

    // driver.findElement({css: '[name="iekUrlico"]'}).sendKeys('ООО «ИЭК ХОЛДИНГ»');
    driver.executeScript("$('[name=\"iekUrlico\"]').val('1')");
    // driver.findElement({css: '[name="partnerKod"]'}).sendKeys('Электрофф ООО');
    driver.executeScript("$('[name=\"partnerKod\"]').val('7060')");

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="verifyDateStart"]'}).sendKeys(randDateStr);

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="verifyDateEnd"]'}).sendKeys(randDateStr);

    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.sleep(1000);

    driver.executeScript("var retJSVar = {}; \
        retJSVar.text = $('[name=\"VFile\"]').siblings('.js-signform-alert').text(); \
        return retJSVar;").then(
      function(ret) {
        assert(ret.text == 'Выберите непустой PDF файл для загрузки!');
      });

    driver.findElement({css: '[name="VFile"]'}).sendKeys(__dirname + '/../files/api.pdf');
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.wait(until.urlIs('http://192.168.58.235/sign/verify/'), 1000);
  });

  test.it('Confirm verify', function() {
    driver.get('http://192.168.58.235/sign/verify/');
    driver.wait(until.elementLocated({css: '.js-form-details'}), 1000);

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