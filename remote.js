// TODO

var wd = require('selenium-webdriver');
var assert = require('assert');

// var SELENIUM_HOST = 'http://localhost:4444/wd/hub';
var SELENIUM_HOST = 'http://10.0.1.20:4444/wd/hub';
var URL = 'http://www.yandex.ru';

var client = new wd.Builder()
   .usingServer(SELENIUM_HOST)
   .withCapabilities({ browserName: 'firefox' })
   .build();

client.get(URL).then(function() {
    client.findElement({ name: 'text' }).sendKeys('test');
    client.findElement({ css: '.b-form-button__input' }).click();

    client.getTitle().then(function(title) {
        assert.ok(title.indexOf('test — Яндекс: нашлось') > -1, 'Ничего не нашлось :(');
    });

    client.quit();
});