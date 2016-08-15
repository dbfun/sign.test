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
    assert = require('assert');

var profile = new Firefox.Profile();

profile.setPreference('browser.download.folderList', 2);
profile.setPreference('browser.download.manager.showWhenStarting', false);
profile.setPreference('browser.download.dir', '/tmp');
profile.setPreference('browser.helperApps.neverAsk.saveToDisk', "application/xml,application/octet-stream,text/plain,text/xml,image/jpeg,image/png,image/gif");

var opts = new Firefox.Options().setProfile(profile);

test.describe('Cargo', function() {
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

  test.it('Create cargo', function() {
    driver.get('http://192.168.58.235/partner/signcargo/');
    driver.findElement({css: '[data-test="create-new"]'}).click();
    driver.wait(until.urlContains('?view=form'), 1000);
    driver.wait(until.elementLocated({css: '[name="iekUrlico"]'}), 500);

    driver.findElement({css: '[name="iekUrlico"]'}).sendKeys('ООО «ИЭК ХОЛДИНГ»');
    driver.executeScript("$('[name=\"ipOrUrlico\"]').val('2').trigger('change')");

    driver.findElement({css: '[name="headOgrnIp"]'}).sendKeys(315392600033691 + Math.floor(Math.random() * 1000000) );

    driver.findElement({css: '[name="headPlace"]'}).sendKeys('Россия, 236029, г. Калининград, ул. Полковника Ефремова, д.2, кв. 73');
    driver.findElement({css: '[name="headAddress"]'}).sendKeys('Россия, 236029, г. Калининград, Московский проспект, 195');
    driver.findElement({css: '[name="headPhoneFax"]'}).sendKeys('8 (4012) 777-999');
    driver.findElement({css: '[name="headBank"]'}).sendKeys("Р/С 40802810375000008026\nФ-Л \"Европейский\" ПАО Банк Санкт-Петербург\nБИК 042748877\nг. Калининград\nК/С 30101810927480000877");
    driver.findElement({css: '[name="footHeadFio"]'}).sendKeys("Котов А.М.");
    driver.findElement({css: '[name="footHeadPost"]'}).sendKeys('Генеральный директор');

    driver.findElement({css: '[name="name"]'}).sendKeys("ООО \"Регион " + Math.floor(Math.random() * 1000) + "\"");
    driver.findElement({css: '[name="ogrn"]'}).sendKeys(1117746254922 + Math.floor(Math.random() * 1000000));
    driver.findElement({css: '[name="innkpp"]'}).sendKeys('7716686249/771601001');
    driver.findElement({css: '[name="place"]'}).sendKeys('129344, г. Москва, ул. Искры, д.31, корп. 1, офис 702');
    driver.findElement({css: '[name="address"]'}).sendKeys("МО, Ленинский район, Проектируемый проезд № 253, промзона \"ВЗ ГИАП\"");
    driver.findElement({css: '[name="bank"]'}).sendKeys("р/с 40702810800000116903 в ПАО \"ВТБ 24\" г. Москва, к/с 30101810100000000716, БИК 044525716");
    driver.findElement({css: '[name="headPerson"]'}).sendKeys("Генеральный директор Бебуа Игори Гурамович");
    driver.findElement({css: '[name="contactPerson"]'}).sendKeys("Генеральный директор Бебуа Игори Гурамович");
    driver.findElement({css: '[name="phone"]'}).sendKeys("8-903-729-54-29, 8 (495) 961-03-37");
    driver.findElement({css: '[name="email"]'}).sendKeys("kld.region-39@inbox.ru");

    driver.findElement({css: '[name="letterAddress"]'}).sendKeys("МО, Ленинский район, Проектируемый проезд № 253, промзона \"ВЗ ГИАП\"");

    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.sleep(1000);

    driver.executeScript("var retJSVar = {}; \
        retJSVar.text = $('[name=\"headInn\"]').siblings('.js-signform-alert').text(); \
        return retJSVar;").then(
      function(ret) {
        // console.log(ret);
        assert(ret.text == 'Неправильно указано ИНН. Правильный формат: 10 или 12 цифр. Пример: 1234567890');
      });

    driver.findElement({css: '[name="headInn"]'}).sendKeys(7716686249 + Math.floor(Math.random() * 1000000) );
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.wait(until.urlIs('http://192.168.58.235/partner/signcargo/'), 1000);
  });



  test.it('Edit cargo', function() {
    driver.get('http://192.168.58.235/partner/signcargo/');
    driver.findElement({css: '.js-doc-edit'}).click();
    driver.wait(until.urlContains('?view=edit'), 1000);

    driver.findElement({css: '[name="ogrn"]'}).clear();
    driver.findElement({css: '[name="ogrn"]'}).sendKeys(1117746254922 + Math.floor(Math.random() * 1000000));

    driver.wait(until.elementLocated({css: '.js-signform [type="submit"]'}), 500);
    driver.sleep(500);
    driver.findElement({css: '.js-signform [type="submit"]'}).click(); // Not working WTF?
    driver.wait(until.urlIs('http://192.168.58.235/partner/signcargo/'), 5000, 'submit');
  });

  test.it('Sign cargo', function() {
    driver.get('http://192.168.58.235/partner/signcargo/');

    driver.findElement({css: '.js-doc-sign'}).click();
    driver.wait(until.elementLocated({css: '[data-test="sign-doc-thumbnail"]'}), 500);
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
        // console.log(ret);
        assert(ret.fileCode == 200);
        assert(ret.thumbnailCode == 200);
      });

    driver.findElement({css: '#cboxClose'}).click();
    driver.sleep(500);
  });

  test.it('Thumbnail cargo', function() {
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


    /*driver.takeScreenshot().then(
      function(image, err) {
        fs.writeFileSync('var/shot.png', image, 'base64', function(err) {
            console.log(err);
        });
      }
    );*/

    /*driver.getAllWindowHandles().then(function (handles) {
        driver.switchTo().window(handles[1]);
        driver.close();
        driver.switchTo().window(handles[0]);
    });

    */
  });





  test.after(function() {
    driver.quit();
  });
});

