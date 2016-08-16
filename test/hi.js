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
    assert = require('assert');

var profile = new Firefox.Profile();

profile.setPreference('browser.download.folderList', 2);
profile.setPreference('browser.download.manager.showWhenStarting', false);
profile.setPreference('browser.download.dir', '/tmp');
profile.setPreference('browser.helperApps.neverAsk.saveToDisk', "application/xml,application/octet-stream,text/plain,text/xml,image/jpeg,image/png,image/gif");

var opts = new Firefox.Options().setProfile(profile);

test.describe('Hi', function() {
  var driver, cookies;

  test.before(function() {

    driver = new webdriver.Builder()
        .withCapabilities(webdriver.Capabilities.firefox())
        .setFirefoxOptions(opts)
        .build();

    cookies = JSON.parse(fs.readFileSync(config.login.partner.file));
    driver.get(config.login.partner.uri);
    for(var i in cookies) {
      driver.manage().addCookie(cookies[i]);
    }
    driver.get(config.login.partner.uri);
    driver.sleep(500);

    driver.getTitle().then(function(title) {
      if(title == 'Авторизация') {
          console.log('Авторизация...');
          driver.manage().deleteAllCookies();
          driver.get(config.login.partner.uri);

          driver.findElement({ css: '.authTab [name="USER_LOGIN"]' }).sendKeys(config.login.partner.user);
          driver.findElement({ css: '.authTab [name="USER_PASSWORD"]'}).sendKeys(config.login.partner.password);

          driver.findElement({ type: 'submit', name : 'Login'}).click();
          driver.wait(until.titleIs('ЭЦП: Уведомление о грузополучателе'), 1000);

          driver.manage().getCookies().then(function (cookies) {
            fs.writeFile(config.login.partner.file, JSON.stringify(cookies, null, 2));
          });
      }
    });
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

