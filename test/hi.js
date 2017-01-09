/**
 * Usage: mocha -t 10000 test/hi
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

test.describe('Hi', function() {
  var driver;

  test.before(function() {
    driver = authbrowser.createDriver('partnerHi');
  });

  test.it('Sign hi', function() {
    driver.get('http://192.168.58.235/partner/sign/');

    driver.wait(until.elementLocated({css: '.js-doc-sign'}), 500);

    driver.findElement({css: '.js-doc-sign'}).click();
    driver.sleep(500);

    driver.wait(until.elementLocated({css: '.js-sign-upload-control'}, 500));

    driver.findElement({ css: '.js-upload-dataset [name="file"]'}).sendKeys(__dirname + '/../files/hello.txt');

    driver.sleep(2000);

    driver.executeScript("return $('.js-upload-result .notify-error').text();").then(
      function(ret) {
        assert(ret == 'Ошибка подписи. Убедитесь что документ подписан сертификатом, выданным IEK');
      });

    driver.findElement({css: '#cboxClose'}).click();
    driver.sleep(500);
  });

  test.it('Thumbnail hi', function() {
    driver.wait(until.elementLocated({css: '.js-doc-thumbnail'}), 500);
    driver.findElement({css: '.js-doc-thumbnail'}).click();
    driver.sleep(500);

    driver.executeScript("var retJSVar = {}; \
        retJSVar.UriThumbnail = $('.js-sign-thumbnail-img a').attr('href'); \
        $.ajax({url: retJSVar.UriThumbnail, type: 'GET', cache: false, async: false, \
          complete: function (XMLHttpRequest, textStatus) {retJSVar.thumbnailCode = XMLHttpRequest.status;} }); \
        return retJSVar;").then(
      function(ret) {
        assert(ret.thumbnailCode == 200);
      });
  });

  test.it('Search hi', function() {
    driver.get('http://192.168.58.235/partner/sign/');
    driver.wait(until.elementLocated({css: '.js-tabs-control .sign-tab-control[data-tab="search"]'}), 500);

    driver.findElement({css: '.js-tabs-control .sign-tab-control[data-tab="search"]'}).click();
    driver.sleep(500);

    driver.findElement({css: '.js-sign-search-input'}).sendKeys('ХИ005894');
    driver.findElement({css: '.js-sign-search'}).click();
    driver.wait(until.elementLocated({css: '.js-doc-thumbnail[data-title="ХИ005894"]'}), 2000);



  });

  test.after(function() {
    driver.quit();
  });
});

