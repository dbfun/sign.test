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

var profile = new Firefox.Profile();

profile.setPreference('browser.download.folderList', 2);
profile.setPreference('browser.download.manager.showWhenStarting', false);
profile.setPreference('browser.download.dir', '/tmp');
profile.setPreference('browser.helperApps.neverAsk.saveToDisk', "application/xml,application/octet-stream,text/plain,text/xml,image/jpeg,image/png,image/gif");

var opts = new Firefox.Options().setProfile(profile);

test.describe('Hi', function() {
  var driver, cookies;

  test.before(function() {
    driver = authbrowser.createDriver('partnerCargo');
  });

  test.it('Sign hi', function() {
    driver.get('http://192.168.58.235/partner/sign/');

    driver.findElement({css: '.js-doc-sign'}).click();
    driver.sleep(500);

    driver.wait(until.elementLocated({css: '.js-sign-upload-control'}, 500));

    driver.findElement({ css: '.js-upload-dataset [name="file"]'}).sendKeys(__dirname + '/../files/hello.txt');

    driver.executeScript("$('.js-upload-dataset [name=\"file\"]').trigger('change')");
    driver.sleep(1000);

    driver.executeScript("return $('.js-upload-result .notify-error').text();").then(
      function(ret) {
        // console.log(ret);
        assert(ret == 'Ошибка подписи. Убедитесь что документ подписан сертификатом, выданным IEK');
      });

    driver.findElement({css: '#cboxClose'}).click();
    driver.sleep(500);
  });

  test.it('Thumbnail hi', function() {

    driver.findElement({css: '.js-doc-thumbnail'}).click();
    driver.sleep(500);

    driver.executeScript("var retJSVar = {}; \
        retJSVar.UriThumbnail = $('.js-sign-thumbnail-img a').attr('href'); \
        $.ajax({url: retJSVar.UriThumbnail, type: 'GET', cache: false, async: false, \
          complete: function (XMLHttpRequest, textStatus) {retJSVar.thumbnailCode = XMLHttpRequest.status;} }); \
        return retJSVar;").then(
      function(ret) {
        // console.log(ret);
        assert(ret.thumbnailCode == 200);
      });
  });





  test.after(function() {
    driver.quit();
  });
});

