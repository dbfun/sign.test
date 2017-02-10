/**
 * Usage: mocha -t 10000 test/netting
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

test.describe('Netting', function() {
  var driver;

  test.before(function() {
    driver = authbrowser.createDriver('fd');
  });

  test.it('Create netting', function() {
    driver.get('http://192.168.58.235/sign/netting/');
    driver.wait(until.elementLocated({css: '[data-test="create-new"]'}), 500);
    driver.findElement({css: '[data-test="create-new"]'}).click();

    driver.wait(until.urlContains('?view=form'), 1000);
    driver.wait(until.elementLocated({css: '[name="iekUrlico"]'}), 500);

    // driver.findElement({css: '[name="iekUrlico"]'}).sendKeys('ООО «ИЭК ХОЛДИНГ»');
    driver.executeScript("$('[name=\"iekUrlico\"]').val('1')");
    // driver.findElement({css: '[name="partnerKod"]'}).sendKeys('Электрофф ООО');
    driver.executeScript("$('[name=\"partnerKod\"]').val('7060')");


    driver.findElement({css: '[name="docNumber"]'}).sendKeys(Math.floor(Math.random() * 1000) + 1000);

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="docDate"]'}).sendKeys(randDateStr);

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

    driver.wait(until.urlIs('http://192.168.58.235/sign/netting/'), 1000);
  });

  test.it('Confirm netting', function() {
    driver.get('http://192.168.58.235/sign/netting/');
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

  test.it('Sign netting', function() {
    var driver;
    driver = authbrowser.createDriver('partnerNetting');
    driver.get('http://192.168.58.235/partner/signnetting/');
    driver.wait(until.elementLocated({css: '.js-form-details'}), 1000);

    driver.executeScript("$('.js-doc-sign').first().click();");
    driver.sleep(500);
    driver.wait(until.elementLocated({css: '[data-test="sign-doc-thumbnail"]'}), 1000);
    driver.sleep(500);


    driver.executeScript("var retJSVar = {}; \
        retJSVar.UriThumbnail = $(\"[data-test='sign-doc-thumbnail']\").attr('href'); \
        retJSVar.UriFile = $(\"[data-test='sign-doc-file']\").attr('href'); \
        $.ajax({url: retJSVar.UriThumbnail, type: 'GET', cache: false, async: false, \
          complete: function (XMLHttpRequest, textStatus) {retJSVar.thumbnailCode = XMLHttpRequest.status;} }); \
        $.ajax({url: retJSVar.UriFile, type: 'GET', cache: false, async: false, \
          complete: function (XMLHttpRequest, textStatus) {retJSVar.fileCode = XMLHttpRequest.status;} }); \
        return retJSVar;").then(
      function(ret) {
        assert(ret.fileCode == 200);
        assert(ret.thumbnailCode == 200);
      });

    driver.findElement({css: '#cboxClose'}).click();
    driver.sleep(500);

    driver.quit();
  });


  test.after(function() {
    driver.quit();
  });
});