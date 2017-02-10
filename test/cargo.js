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

test.describe('Cargo', function() {
  var driver;

  test.before(function() {
    driver = authbrowser.createDriver('partnerCargo');
  });

  test.it('Create cargo doc+letter ip', function() {
    driver.get('http://192.168.58.235/partner/signcargo/');
    driver.wait(until.elementLocated({css: '[data-test="create-new"]'}), 500);

    driver.findElement({css: '[data-test="create-new"]'}).click();
    driver.wait(until.urlContains('?view=form'), 1000);
    driver.wait(until.elementLocated({css: '[name="docSetType"]'}), 500);

    // Уведомление + письмо
    driver.executeScript("$('[name=\"docSetType\"]').val('1').trigger('change')");
    driver.sleep(1000);

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="udDate"]'}).sendKeys(randDateStr);

    driver.executeScript("$('[name=\"iekUrlico\"]').val('1')");
    // ИП
    driver.executeScript("$('[name=\"ipOrUrlico\"]').val('2').trigger('change')");

    driver.findElement({css: '[name="headOgrnIp"]'}).sendKeys(315392600033691 + Math.floor(Math.random() * 1000000) );

    driver.findElement({css: '[name="headPlace"]'}).sendKeys('Россия, 236029, г. Калининград, ул. Полковника Ефремова, д.2, кв. 73');
    driver.findElement({css: '[name="headAddress"]'}).sendKeys('Россия, 236029, г. Калининград, Московский проспект, 195');
    driver.findElement({css: '[name="headPhoneFax"]'}).sendKeys('8 (4012) 777-999');
    driver.findElement({css: '[name="headBank"]'}).sendKeys("Р/С 40802810375000008026\nФ-Л \"Европейский\" ПАО Банк Санкт-Петербург\nБИК 042748877\nг. Калининград\nК/С 30101810927480000877");
    driver.findElement({css: '[name="footHeadFio"]'}).sendKeys("Котов А.М.");
    driver.findElement({css: '[name="footHeadPost"]'}).sendKeys('Генеральный директор');

    driver.findElement({css: '[name="name"]'}).sendKeys("ООО \"Регион " + Math.floor(Math.random() * 1000) + "\"" + ' doc+letter ip');
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

    // без "перемотки" не работает
    driver.executeScript("$('html, body').animate({scrollTop: $('.js-signform [type=\"submit\"]').offset().top}, 0);");
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.sleep(1000);

    driver.executeScript("var retJSVar = {}; \
        retJSVar.text = $('[name=\"headInn\"]').siblings('.js-signform-alert').text(); \
        return retJSVar;").then(
      function(ret) {
        assert(ret.text == 'Неправильно указан ИНН. Правильный формат: 10 или 12 цифр. Пример: 1234567890');
      });

    driver.findElement({css: '[name="headInn"]'}).sendKeys(7716686249 + Math.floor(Math.random() * 1000000) );

    // без "перемотки" не работает
    driver.executeScript("$('html, body').animate({scrollTop: $('.js-signform [type=\"submit\"]').offset().top}, 0);");
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.wait(until.urlIs('http://192.168.58.235/partner/signcargo/'), 1000);
  });


  test.it('Create cargo doc ul', function() {
    driver.get('http://192.168.58.235/partner/signcargo/');
    driver.wait(until.elementLocated({css: '[data-test="create-new"]'}), 500);

    driver.findElement({css: '[data-test="create-new"]'}).click();
    driver.wait(until.urlContains('?view=form'), 1000);
    driver.wait(until.elementLocated({css: '[name="docSetType"]'}), 500);

    // Уведомление
    driver.executeScript("$('[name=\"docSetType\"]').val('2').trigger('change')");
    driver.sleep(1000);

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="udDate"]'}).sendKeys(randDateStr);

    driver.executeScript("$('[name=\"iekUrlico\"]').val('1')");
    // Юр
    driver.executeScript("$('[name=\"ipOrUrlico\"]').val('1').trigger('change')");

    driver.findElement({css: '[name="headOgrn"]'}).sendKeys(1234567890123 + Math.floor(Math.random() * 1000000) );
    driver.findElement({css: '[name="headKpp"]'}).sendKeys(123456789 + Math.floor(Math.random() * 100000) );

    driver.findElement({css: '[name="headPlace"]'}).sendKeys('Россия, 236029, г. Калининград, ул. Полковника Ефремова, д.2, кв. 73');
    driver.findElement({css: '[name="headAddress"]'}).sendKeys('Россия, 236029, г. Калининград, Московский проспект, 195');
    driver.findElement({css: '[name="headPhoneFax"]'}).sendKeys('8 (4012) 777-999');
    driver.findElement({css: '[name="headBank"]'}).sendKeys("Р/С 40802810375000008026\nФ-Л \"Европейский\" ПАО Банк Санкт-Петербург\nБИК 042748877\nг. Калининград\nК/С 30101810927480000877");
    driver.findElement({css: '[name="footHeadFio"]'}).sendKeys("Котов А.М.");
    driver.findElement({css: '[name="footHeadPost"]'}).sendKeys('Генеральный директор');

    driver.findElement({css: '[name="name"]'}).sendKeys("ООО \"Регион " + Math.floor(Math.random() * 1000) + "\"" + " doc ul");
    driver.findElement({css: '[name="ogrn"]'}).sendKeys(1117746254922 + Math.floor(Math.random() * 1000000));
    driver.findElement({css: '[name="innkpp"]'}).sendKeys('7716686249/771601001');
    driver.findElement({css: '[name="place"]'}).sendKeys('129344, г. Москва, ул. Искры, д.31, корп. 1, офис 702');
    driver.findElement({css: '[name="address"]'}).sendKeys("МО, Ленинский район, Проектируемый проезд № 253, промзона \"ВЗ ГИАП\"");
    driver.findElement({css: '[name="bank"]'}).sendKeys("р/с 40702810800000116903 в ПАО \"ВТБ 24\" г. Москва, к/с 30101810100000000716, БИК 044525716");
    driver.findElement({css: '[name="headPerson"]'}).sendKeys("Генеральный директор Бебуа Игори Гурамович");
    driver.findElement({css: '[name="contactPerson"]'}).sendKeys("Генеральный директор Бебуа Игори Гурамович");
    driver.findElement({css: '[name="phone"]'}).sendKeys("8-903-729-54-29, 8 (495) 961-03-37");
    driver.findElement({css: '[name="email"]'}).sendKeys("kld.region-39@inbox.ru");

    // без "перемотки" не работает
    driver.executeScript("$('html, body').animate({scrollTop: $('.js-signform [type=\"submit\"]').offset().top}, 0);");
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.sleep(1000);

    driver.executeScript("var retJSVar = {}; \
        retJSVar.text = $('[name=\"headInn\"]').siblings('.js-signform-alert').text(); \
        return retJSVar;").then(
      function(ret) {
        assert(ret.text == 'Неправильно указан ИНН. Правильный формат: 10 или 12 цифр. Пример: 1234567890');
      });

    driver.findElement({css: '[name="headInn"]'}).sendKeys(7716686249 + Math.floor(Math.random() * 1000000) );

    // без "перемотки" не работает
    driver.executeScript("$('html, body').animate({scrollTop: $('.js-signform [type=\"submit\"]').offset().top}, 0);");
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.wait(until.urlIs('http://192.168.58.235/partner/signcargo/'), 1000);
  });


  test.it('Create cargo letter ul', function() {
    driver.get('http://192.168.58.235/partner/signcargo/');
    driver.wait(until.elementLocated({css: '[data-test="create-new"]'}), 500);

    driver.findElement({css: '[data-test="create-new"]'}).click();
    driver.wait(until.urlContains('?view=form'), 1000);
    driver.wait(until.elementLocated({css: '[name="docSetType"]'}), 500);

    // Уведомление
    driver.executeScript("$('[name=\"docSetType\"]').val('3').trigger('change')");
    driver.sleep(1000);

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="udDate"]'}).sendKeys(randDateStr);

    driver.executeScript("$('[name=\"iekUrlico\"]').val('1')");
    // Юр
    driver.executeScript("$('[name=\"ipOrUrlico\"]').val('1').trigger('change')");

    driver.findElement({css: '[name="headOgrn"]'}).sendKeys(1234567890123 + Math.floor(Math.random() * 1000000) );
    driver.findElement({css: '[name="headKpp"]'}).sendKeys(123456789 + Math.floor(Math.random() * 100000) );

    driver.findElement({css: '[name="headPlace"]'}).sendKeys('Россия, 236029, г. Калининград, ул. Полковника Ефремова, д.2, кв. 73');
    driver.findElement({css: '[name="headAddress"]'}).sendKeys('Россия, 236029, г. Калининград, Московский проспект, 195');
    driver.findElement({css: '[name="headPhoneFax"]'}).sendKeys('8 (4012) 777-999');
    driver.findElement({css: '[name="headBank"]'}).sendKeys("Р/С 40802810375000008026\nФ-Л \"Европейский\" ПАО Банк Санкт-Петербург\nБИК 042748877\nг. Калининград\nК/С 30101810927480000877");
    driver.findElement({css: '[name="footHeadFio"]'}).sendKeys("Котов А.М.");

    driver.findElement({css: '[name="innkpp"]'}).sendKeys('7716686249/771601001');
    driver.findElement({css: '[name="name"]'}).sendKeys("ООО \"Регион " + Math.floor(Math.random() * 1000) + "\"" + " letter ul");
    driver.findElement({css: '[name="letterAddress"]'}).sendKeys("МО, Ленинский район, Проектируемый проезд № 253, промзона \"ВЗ ГИАП\"");

    // без "перемотки" не работает
    driver.executeScript("$('html, body').animate({scrollTop: $('.js-signform [type=\"submit\"]').offset().top}, 0);");
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.sleep(1000);

    driver.executeScript("var retJSVar = {}; \
        retJSVar.text = $('[name=\"headInn\"]').siblings('.js-signform-alert').text(); \
        return retJSVar;").then(
      function(ret) {
        assert(ret.text == 'Неправильно указан ИНН. Правильный формат: 10 или 12 цифр. Пример: 1234567890');
      });

    driver.findElement({css: '[name="headInn"]'}).sendKeys(7716686249 + Math.floor(Math.random() * 1000000) );

    // без "перемотки" не работает
    driver.executeScript("$('html, body').animate({scrollTop: $('.js-signform [type=\"submit\"]').offset().top}, 0);");
    driver.findElement({css: '.js-signform [type="submit"]'}).click();

    driver.wait(until.urlIs('http://192.168.58.235/partner/signcargo/'), 1000);
  });





  test.it('Edit cargo', function() {
    driver.get('http://192.168.58.235/partner/signcargo/');
    driver.wait(until.elementLocated({css: '.js-doc-edit'}), 1000);
    driver.findElement({css: '.js-doc-edit'}).click();
    driver.wait(until.urlContains('?view=edit'), 1000);

    driver.wait(until.elementLocated({css: '[name="headInn"]'}), 500);

    driver.findElement({css: '[name="headInn"]'}).clear();
    driver.findElement({css: '[name="headInn"]'}).sendKeys(7716686249 + Math.floor(Math.random() * 1000000) );

    // без "перемотки" не работает
    driver.executeScript("$('html, body').animate({scrollTop: $('.js-signform [type=\"submit\"]').offset().top}, 0);");
    driver.sleep(200);
    driver.findElement({css: '.js-signform [type="submit"]'}).click(); // Not working WTF?
    driver.wait(until.urlIs('http://192.168.58.235/partner/signcargo/'), 5000, 'submit');
  });

  test.it('Sign cargo', function() {
    driver.get('http://192.168.58.235/partner/signcargo/');
    driver.wait(until.elementLocated({css: '.js-form-details'}), 2000);

    // driver.findElement({css: '.js-doc-sign'}).click(); // hidden
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
  });

  test.it('Thumbnail cargo', function() {
    driver.get('http://192.168.58.235/partner/signcargo/');
    driver.wait(until.elementLocated({css: '.js-doc-thumbnail'}), 1000);

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

  test.it('Confirm coord cargo', function() {
    var driver;
    driver = authbrowser.createDriver('coord');
    driver.get('http://192.168.58.235/sign/cargo/');
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

