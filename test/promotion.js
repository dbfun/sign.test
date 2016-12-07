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
  var driver;

  test.before(function() {
    driver = authbrowser.createDriver('dmPromotion');
  });

  test.it('Create promotion', function() {
    driver.get('http://192.168.58.235/sign/promotion/');
    driver.wait(until.elementLocated({css: '[data-test="create-new"]'}), 500);

    driver.findElement({css: '[data-test="create-new"]'}).click();

    driver.wait(until.urlContains('?view=form'), 1000);
    driver.wait(until.elementLocated({css: '[name="iekUrlico"]'}), 500);

    //driver.findElement({css: '[name="iekUrlico"]'}).sendKeys('ООО «ИЭК ХОЛДИНГ»');
    driver.executeScript("$('[name=\"iekUrlico\"]').val('1')");

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="docDate"]'}).sendKeys(randDateStr);

    driver.executeScript("$('[name=\"udVersion\"]').val('1').trigger('change')");

    driver.executeScript("$('[name=\"partnerKod\"]').val('7060')");

    driver.findElement({css: '[name="docAffNumber"]'}).sendKeys('И-М7/3');

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="docAffDate"]'}).sendKeys(randDateStr);

    driver.findElement({css: '[name="firmName"]'}).sendKeys('ИП Метревели Г.В.');
    driver.findElement({css: '[name="sign2Text1"]'}).sendKeys('Генеральный директор Иванов Иван Иванович');

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="intervalStart"]'}).sendKeys(randDateStr);

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="intervalEnd"]'}).sendKeys(randDateStr);

    // multi

    driver.findElement({css: '.js-form-multifield-add[data-name="maketYandexGoogle"]'}).click();
    driver.findElement({css: '[name="maketYandexGoogle[1][cost]"]'}).sendKeys('8000');
    driver.findElement({css: '[name="maketYandexGoogle[1][percent]"]'}).sendKeys('35');


    driver.findElement({css: '.js-form-multifield-add[data-name="maketSite"]'}).click();
    driver.findElement({css: '[name="maketSite[1][cost]"]'}).sendKeys('9000');
    driver.findElement({css: '[name="maketSite[1][site]"]'}).sendKeys('noname.ru');
    driver.findElement({css: '[name="maketSite[1][percent]"]'}).sendKeys('45');

    driver.findElement({css: '.js-form-multifield-add[data-name="maketGis"]'}).click();
    driver.findElement({css: '[name="maketGis[1][cost]"]'}).sendKeys('10000');
    driver.findElement({css: '[name="maketGis[1][percent]"]'}).sendKeys('35');

    driver.findElement({css: '.js-form-multifield-add[data-name="maketIsMod"]'}).click();
    driver.findElement({css: '[name="maketIsMod[1][izdanie]"]'}).sendKeys('ООО Дрофа');
    driver.findElement({css: '[name="maketIsMod[1][cost]"]'}).sendKeys('12000');
    driver.findElement({css: '[name="maketIsMod[1][percent]"]'}).sendKeys('45');

    driver.findElement({css: '.js-form-multifield-add[data-name="promotionBanner"]'}).click();
    driver.findElement({css: '[name="promotionBanner[1][cost]"]'}).sendKeys('11000');
    driver.findElement({css: '[name="promotionBanner[1][percent]"]'}).sendKeys('10');


    driver.findElement({css: '.js-form-multifield-add[data-name="promotionBannerRent"]'}).click();
    driver.findElement({css: '[name="promotionBannerRent[1][cost]"]'}).sendKeys('12000');
    driver.findElement({css: '[name="promotionBannerRent[1][percent]"]'}).sendKeys('20');

    driver.findElement({css: '.js-form-multifield-add[data-name="promotionPoster"]'}).click();
    driver.findElement({css: '[name="promotionPoster[1][cost]"]'}).sendKeys('13000');
    driver.findElement({css: '[name="promotionPoster[1][percent]"]'}).sendKeys('30');

    driver.findElement({css: '.js-form-multifield-add[data-name="exhibitions"]'}).click();
    driver.findElement({css: '[name="exhibitions[1][name]"]'}).sendKeys('Всероссийская выставка электротехнической продукции');
    driver.findElement({css: '[name="exhibitions[1][cost]"]'}).sendKeys('10000');
    driver.findElement({css: '[name="exhibitions[1][percent]"]'}).sendKeys('30');

    driver.findElement({css: '.js-form-multifield-add[data-name="seminarCity"]'}).click();
    driver.findElement({css: '[name="seminarCity[1][city]"]'}).sendKeys('Москва');
    driver.findElement({css: '[name="seminarCity[1][cost]"]'}).sendKeys('5000');
    driver.findElement({css: '[name="seminarCity[1][percent]"]'}).sendKeys('80');

    driver.findElement({css: '.js-form-multifield-add[data-name="eventm"]'}).click();
    driver.findElement({css: '[name="eventm[1][name]"]'}).sendKeys('Митап застройщиков');
    driver.findElement({css: '[name="eventm[1][cost]"]'}).sendKeys('10000');
    driver.findElement({css: '[name="eventm[1][percent]"]'}).sendKeys('75');

    driver.findElement({css: '.js-form-multifield-add[data-name="brandingComp"]'}).click();
    driver.findElement({css: '[name="brandingComp[1][cost]"]'}).sendKeys('7800');
    driver.findElement({css: '[name="brandingComp[1][percent]"]'}).sendKeys('90');

    driver.findElement({css: '.js-form-multifield-add[data-name="brandingCompRent"]'}).click();
    driver.findElement({css: '[name="brandingCompRent[1][cost]"]'}).sendKeys('28000');
    driver.findElement({css: '[name="brandingCompRent[1][percent]"]'}).sendKeys('80');


    driver.findElement({css: '.js-form-multifield-add[data-name="catalog"]'}).click();
    driver.findElement({css: '[name="catalog[1][name]"]'}).sendKeys('Каталог электротехнической продукции');
    driver.findElement({css: '[name="catalog[1][cost]"]'}).sendKeys('100000');
    driver.findElement({css: '[name="catalog[1][percent]"]'}).sendKeys('30');

    driver.findElement({css: '.js-form-multifield-add[data-name="leaflet"]'}).click();
    driver.findElement({css: '[name="leaflet[1][name]"]'}).sendKeys('Листовка электротехнической продукции');
    driver.findElement({css: '[name="leaflet[1][cost]"]'}).sendKeys('100000');
    driver.findElement({css: '[name="leaflet[1][percent]"]'}).sendKeys('30');

    driver.findElement({css: '.js-form-multifield-add[data-name="souvenirProd"]'}).click();
    driver.findElement({css: '[name="souvenirProd[1][name]"]'}).sendKeys('Ручки с фирменным логотипом');
    driver.findElement({css: '[name="souvenirProd[1][cost]"]'}).sendKeys('10000');
    driver.findElement({css: '[name="souvenirProd[1][percent]"]'}).sendKeys('40');

    driver.findElement({css: '.js-form-multifield-add[data-name="posm"]'}).click();
    driver.findElement({css: '[name="posm[1][name]"]'}).sendKeys('POSM');
    driver.findElement({css: '[name="posm[1][cost]"]'}).sendKeys('7800');
    driver.findElement({css: '[name="posm[1][percent]"]'}).sendKeys('30');

    driver.findElement({css: '.js-form-multifield-add[data-name="stand"]'}).click();
    driver.findElement({css: '[name="stand[1][name]"]'}).sendKeys('Стенд электротехнической продукции');
    driver.findElement({css: '[name="stand[1][cost]"]'}).sendKeys('9000');
    driver.findElement({css: '[name="stand[1][percent]"]'}).sendKeys('50');

    driver.findElement({css: '.js-form-multifield-add[data-name="clause"]'}).click();
    driver.findElement({css: '[name="clause[1][name]"]'}).sendKeys('Дополнительная статья расходов');
    driver.findElement({css: '[name="clause[1][cost]"]'}).sendKeys('9000');
    driver.findElement({css: '[name="clause[1][percent]"]'}).sendKeys('50');

    driver.findElement({css: '[name="printing"]'}).sendKeys('100000');
    driver.findElement({css: '[name="souvenir"]'}).sendKeys('200000');
    driver.findElement({css: '[name="productExamples"]'}).sendKeys('300000');
    driver.findElement({css: '[name="POSmaterials"]'}).sendKeys('400000');
    driver.findElement({css: '[name="demonstrationBoards"]'}).sendKeys('500000');


    // test empty field
    driver.findElement({css: '.js-signform [type="submit"]'}).click();
    driver.sleep(1000);
    driver.executeScript("var retJSVar = {}; \
        retJSVar.text = $('[name=\"udDate\"]').siblings('.js-signform-alert').text(); \
        return retJSVar;").then(
      function(ret) {
        assert(ret.text == 'Неправильно указана дата');
      });

    var randDate = new Date(2016, Math.floor(Math.random() * 12 + 1), Math.floor(Math.random() * 28 + 1));
    var randDateStr = randDate.format("dd.mm.yyyy");
    driver.findElement({css: '[name="udDate"]'}).sendKeys(randDateStr);


    driver.findElement({css: '.js-signform [type="submit"]'}).click();
    driver.wait(until.urlIs('http://192.168.58.235/sign/promotion/'), 1000);

  });

  test.it('Confirm promotion', function() {
    driver.get('http://192.168.58.235/sign/promotion/');
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