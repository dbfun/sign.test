/**
 * Usage: mocha -t 10000 test/terms
 */

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    test = require('selenium-webdriver/testing'),
    fs = require('fs'),
    config = require('../config.json'),
    assert = require('assert'),
    authbrowser = require('../lib/authbrowser'),
    data = require('../lib/data');

require('../lib/date');

test.describe('Terms', function() {
  var driver;

  test.before(function() {
    driver = authbrowser.createDriver('coord');
  });

  test.it('Create terms', function() {
    driver.get('http://192.168.58.235/sign/terms/');
    driver.wait(until.elementLocated({css: '[data-test="create-new"]'}), 500);

    driver.findElement({css: '[data-test="create-new"]'}).click();

    driver.wait(until.urlContains('?view=form'), 1000);
    driver.wait(until.elementLocated({css: '[name="iekUrlico"]'}), 500);

    driver.findElement({css: '[name="udDate"]'}).sendKeys(data.randDateStr(2016));

    driver.findElement({css: '[name="iekUrlico"]'}).sendKeys('ООО «ИЭК ХОЛДИНГ»');
    driver.findElement({css: '[name="dppNumber"]'}).sendKeys('И-А/' + data.randFloat(1000, 10000, 0));
    driver.findElement({css: '[name="dppDate"]'}).sendKeys('01.01.2016');

    driver.executeScript("$('[name=\"ipOrUrlico\"]').val('2').trigger('change')");

    driver.findElement({css: '[name="footerIpHeadPosition"]'}).sendKeys('директор');
    driver.findElement({css: '[name="ipFirstName"]'}).sendKeys('Котов');
    driver.findElement({css: '[name="ipSecondName"]'}).sendKeys('Иван');
    driver.findElement({css: '[name="ipLastName"]'}).sendKeys('Михайлович');

    driver.findElement({css: '[name="blankNumber"]'}).sendKeys( data.randFloat(1000, 10000, 0) ); // 500
    driver.findElement({css: '[name="ogrnIp"]'}).sendKeys(315392600033691 + Math.floor(Math.random() * 1000000) );

    //driver.findElement({css: '[name="paymentOrderVar"]'}).sendKeys('отсрочка платежа');
    driver.executeScript("$('[name=\"paymentOrderVar\"]').val('2').trigger('change')");
    driver.wait(until.elementLocated({css: '[name="paymentOrderDays"]'}), 500);
    driver.sleep(200);
    driver.findElement({css: '[name="paymentOrderDays"]'}).sendKeys('30');

    // Commerce
    // driver.findElement({css: '[name="partnerType"]'}).sendKeys('дистрибьютор');
    driver.executeScript("$('[name=\"partnerType\"]').val('1').trigger('change')");
    driver.sleep(500);

    driver.findElement({css: '[name="discount_type_1_1"]'}).clear();
    driver.findElement({css: '[name="discount_type_1_2"]'}).clear();
    driver.findElement({css: '[name="discount_comp_type_1_1"]'}).clear();

    driver.findElement({css: '[name="discount_type_1_1"]'}).sendKeys( data.randFloat(10, 30, 0) ); // 33
    driver.findElement({css: '[name="discount_type_1_2"]'}).sendKeys( data.randFloat(10, 30, 0) ); // 33
    driver.findElement({css: '[name="discount_comp_type_1_1"]'}).sendKeys( data.randFloat(0.1, 1, 1) ); // 0.5

    driver.findElement({css: '[name="penaltyVal"]'}).sendKeys( data.randFloat(10, 30, 0) ); // 36
    driver.findElement({css: '[name="otherConditions"]'}).sendKeys('отсутствуют');

    // без "перемотки" не работает
    driver.executeScript("$('html, body').animate({scrollTop: $('.js-signform [type=\"submit\"]').offset().top}, 0);");
    driver.findElement({css: '.js-signform [type="submit"]'}).click();
    driver.sleep(1000);

    driver.executeScript("var retJSVar = {}; \
        retJSVar.text = $('[name=\"blankSeria\"]').siblings('.js-signform-alert').text(); \
        return retJSVar;").then(
      function(ret) {
        assert(ret.text == 'Введите бланк серия');
      });

    driver.findElement({css: '[name="blankSeria"]'}).sendKeys( data.randFloat(1000, 10000, 0) ); // 100
    driver.executeScript("$('html, body').animate({scrollTop: $('.js-signform [type=\"submit\"]').offset().top}, 0);");
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.wait(until.urlIs('http://192.168.58.235/sign/terms/'), 1000);
  });

  test.it('Load set', function() {
    driver.get('http://192.168.58.235/sign/terms/');
    driver.wait(until.elementLocated({css: '[data-test="create-new"]'}), 500);

    driver.findElement({css: '[data-test="create-new"]'}).click();



    driver.wait(until.urlContains('?view=form'), 1000);
    driver.wait(until.elementLocated({css: '.js-loadset-button[data-set="kontragent"]'}), 500);


    driver.sleep(1000);

    driver.findElement({css: '.js-loadset-button[data-set="kontragent"]'}).click();


    driver.switchTo().alert().then(
      function() {
        driver.switchTo().alert().accept();
        driver.sleep(500);
      },
      function() {
        assert(false === 'Должно быть предупреждение alert');
      }
    );




    driver.executeScript("$('.js-loadset-set[data-set=\"kontragent\"]').first().find('option').eq(-1).prop('selected', true);");
    driver.sleep(500);

    driver.findElement({css: '.js-loadset-button[data-set="kontragent"]'}).click();
    driver.sleep(1000);


    driver.executeScript("return $('[name=\"footerIpHeadPosition\"]').val();").then(
      function(ret) {
        assert(ret.length > 0);
      });
  });

  test.it('Edit terms', function() {
    driver.get('http://192.168.58.235/sign/terms/');
    driver.wait(until.elementLocated({css: '.js-doc-edit'}), 1000);
    driver.findElement({css: '.js-doc-edit'}).click();
    driver.wait(until.urlContains('?view=edit'), 1000);
    driver.wait(until.elementLocated({css: '.js-signform [type="submit"]'}), 500);

    // Commerce
    // driver.findElement({css: '[name="partnerType"]'}).sendKeys('дистрибьютор');
    driver.executeScript("$('[name=\"partnerType\"]').val('1').trigger('change')");
    driver.sleep(1000);

    driver.findElement({css: '[name="discount_type_1_1"]'}).clear();
    driver.findElement({css: '[name="discount_type_1_2"]'}).clear();
    driver.findElement({css: '[name="discount_comp_type_1_1"]'}).clear();

    driver.findElement({css: '[name="discount_type_1_1"]'}).sendKeys( data.randFloat(10, 30, 0) ); // 33
    driver.findElement({css: '[name="discount_type_1_2"]'}).sendKeys( data.randFloat(10, 30, 0) ); // 33
    driver.findElement({css: '[name="discount_comp_type_1_1"]'}).sendKeys( data.randFloat(0.1, 1, 1) ); // 0.5

    driver.executeScript("$('html, body').animate({scrollTop: $('.js-signform [type=\"submit\"]').offset().top}, 0);");
    driver.findElement({css: '.js-signform [type="submit"]'}).click();
    driver.wait(until.urlIs('http://192.168.58.235/sign/terms/'), 5000, 'submit');
  });

  test.it('Confirm terms', function() {
    driver.get('http://192.168.58.235/sign/terms/');
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

  test.it('Confirm terms DP head', function() {
    var driver;
    driver = authbrowser.createDriver('dpHead');

    driver.get('http://192.168.58.235/sign/terms/');
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

    driver.quit();
  });

  test.it('Confirm terms lawyer', function() {
    var driver;
    driver = authbrowser.createDriver('lawyer');

    driver.get('http://192.168.58.235/sign/terms/');
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

    driver.quit();
  });


  test.after(function() {
    driver.quit();
  });
});

