/**
 * Usage: mocha -t 10000 test/promotion
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

test.describe('Promotion', function() {
  var driver, cookies;

  test.before(function() {
    driver = authbrowser.createDriver('coord');
  });

  test.it('Create promotion', function() {
    driver.get('http://192.168.58.235/sign/promotion/');
    driver.findElement({css: '[data-test="create-new"]'}).click();

    driver.wait(until.urlContains('?view=form'), 1000);
    driver.wait(until.elementLocated({css: '[name="iekUrlico"]'}), 500);


    driver.findElement({css: '[name="iekUrlico"]'}).sendKeys('ООО «ИЭК ХОЛДИНГ»');

    driver.findElement({css: '[name="sign1Text1"]'}).sendKeys('Руководитель управления маркетинговых коммуникаций Чесновская Е.В.');
    driver.findElement({css: '[name="sign1Text2"]'}).sendKeys('на основании Доверенности №19 от 01.01.2016');

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="docDate"]'}).sendKeys(randDateStr);

    driver.executeScript("$('[name=\"partnerKod\"]').val('7060')");

    driver.findElement({css: '[name="docAffNumber"]'}).sendKeys('И-М7/3');

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="docAffDate"]'}).sendKeys(randDateStr);

    driver.findElement({css: '[name="firmName"]'}).sendKeys('ИП Метревели Г.В.');

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="intervalStart"]'}).sendKeys(randDateStr);

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="intervalEnd"]'}).sendKeys(randDateStr);

    // multi

    driver.findElement({css: '.js-form-multifield-add[data-name="maket"]'}).click();
    driver.findElement({css: '[name="maket[0][sizeNdate]"]'}).sendKeys('80 x 200 см 31 января 2016');
    driver.findElement({css: '[name="maket[0][publisher]"]'}).sendKeys('ЗАО Питер');
    driver.findElement({css: '[name="maket[0][cost]"]'}).sendKeys('8000');
    driver.findElement({css: '[name="maket[0][percent]"]'}).sendKeys('35');


    driver.findElement({css: '.js-form-multifield-add[data-name="article"]'}).click();
    driver.findElement({css: '[name="article[0][lettersNdate]"]'}).sendKeys('2000 знаков, 1 февраля 2016');
    driver.findElement({css: '[name="article[0][publisher]"]'}).sendKeys('ООО Дрофа');
    driver.findElement({css: '[name="article[0][cost]"]'}).sendKeys('12000');
    driver.findElement({css: '[name="article[0][percent]"]'}).sendKeys('45');

    driver.findElement({css: '.js-form-multifield-add[data-name="promotionOut"]'}).click();
    driver.findElement({css: '[name="promotionOut[0][name]"]'}).sendKeys('компенсация за изготовление баннера');
    driver.findElement({css: '[name="promotionOut[0][cost]"]'}).sendKeys('11000');
    driver.findElement({css: '[name="promotionOut[0][percent]"]'}).sendKeys('32');

    driver.findElement({css: '.js-form-multifield-add[data-name="promotionOut"]'}).click();
    driver.findElement({css: '[name="promotionOut[1][name]"]'}).sendKeys('компенсация стоимости аренды рекламной конструкции');
    driver.findElement({css: '[name="promotionOut[1][cost]"]'}).sendKeys('700');
    driver.findElement({css: '[name="promotionOut[1][percent]"]'}).sendKeys('80');

    driver.findElement({css: '.js-form-multifield-add[data-name="exhibitions"]'}).click();
    driver.findElement({css: '[name="exhibitions[0][name]"]'}).sendKeys('Всероссийская выставка электротехнической продукции');
    driver.findElement({css: '[name="exhibitions[0][cost]"]'}).sendKeys('700');
    driver.findElement({css: '[name="exhibitions[0][percent]"]'}).sendKeys('80');




    driver.findElement({css: '[name="printing"]'}).sendKeys('100000');
    driver.findElement({css: '[name="souvenir"]'}).sendKeys('200000');
    driver.findElement({css: '[name="productExamples"]'}).sendKeys('300000');
    driver.findElement({css: '[name="POSmaterials"]'}).sendKeys('400000');
    driver.findElement({css: '[name="demonstrationBoards"]'}).sendKeys('500000');


    driver.findElement({css: '.js-signform [type="submit"]'}).click();
    driver.wait(until.urlIs('http://192.168.58.235/sign/promotion/'), 1000);

  });

  test.after(function() {
    driver.quit();
  });


});