/**
 * Usage: mocha -t 10000 test/cargo
 */

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    test = require('selenium-webdriver/testing'),
    Firefox = require('selenium-webdriver/firefox'),
    fs = require('fs'),
    config = require('../config.json'),
    assert = require('assert'),
    authbrowser = require('../lib/authbrowser');

require('../lib/date');

test.describe('Shipment', function() {
  var driver;

  test.before(function() {
    driver = authbrowser.createDriver('partnerShipment');
  });

  test.it('Create shipment urlico', function() {
    driver.get('http://192.168.58.235/partner/signshipment/');
    driver.wait(until.elementLocated({css: '[data-test="create-new"]'}), 500);

    driver.findElement({css: '[data-test="create-new"]'}).click();
    driver.wait(until.urlContains('?view=form'), 1000);
    driver.wait(until.elementLocated({css: '[name="docNumber"]'}), 500);

    driver.findElement({css: '[name="docNumber"]'}).sendKeys(1 + Math.floor(Math.random() * 10000) );
    driver.findElement({css: '[name="city"]'}).sendKeys('Москва');

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="udDate"]'}).sendKeys(randDateStr);

    driver.executeScript("$('[name=\"iekUrlico\"]').val('1')");

    // юр лицо =>>
    driver.executeScript("$('[name=\"ipOrUrlico\"]').val('1').trigger('change')");
    driver.sleep(500);

    driver.findElement({css: '[name="urlicoOgrn"]'}).sendKeys('1234567890123');
    driver.findElement({css: '[name="urlicoInn"]'}).sendKeys('1234567890');
    driver.findElement({css: '[name="urlicoPlace"]'}).sendKeys('Россия, 236029, г. Калининград, ул. Полковника Ефремова, д.2, кв. 73');
    driver.executeScript("$('[name=\"urlicoPost\"]').val('2')");


    driver.findElement({css: '[name="urlicoHeadFio"]'}).sendKeys('Иванова Ивана Ивановича');
    driver.findElement({css: '[name="urlicoHeadFioBrief"]'}).sendKeys('Иванов И.И.');
    driver.findElement({css: '[name="urlicoBasis"]'}).clear();
    driver.findElement({css: '[name="urlicoBasis"]'}).sendKeys('Устава');
    // <== юр лицо

    // агент: юр
    driver.executeScript("$('[name=\"agentType\"]').val('1').trigger('change')");
    driver.sleep(500);

    driver.findElement({css: '[name="urlicoAgentName"]'}).sendKeys('ООО "Ромашка"');
    driver.findElement({css: '[name="urlicoAgentOgrn"]'}).sendKeys('1234567890123');
    driver.findElement({css: '[name="urlicoAgentInn"]'}).sendKeys('1234567890');
    driver.findElement({css: '[name="urlicoAgentPlace"]'}).sendKeys('Россия, 236029, г. Калининград, Московский проспект, 195');
    driver.findElement({css: '[name="proxyTime"]'}).sendKeys('1 (Один) год');

    // без "перемотки" не работает
    driver.executeScript("$('html, body').animate({scrollTop: $('.js-signform [type=\"submit\"]').offset().top}, 0);");
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.sleep(1000);

    driver.executeScript("var retJSVar = {}; \
      retJSVar.text = $('[name=\"canProxy\"]').siblings('.js-signform-alert').text(); \
      return retJSVar;").then(
    function(ret) {
      assert(ret.text == 'Выберите право передоверия');
    });


    driver.executeScript("$('[name=\"canProxy\"]').val('1')");
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.wait(until.urlIs('http://192.168.58.235/partner/signshipment/'), 1000);

  });


  test.after(function() {
    driver.quit();
  });
});

