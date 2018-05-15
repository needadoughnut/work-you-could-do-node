const Zombie = require('zombie');
const basePath = process.env.EXPRESS_BASE_PATH || '';
const port = require('../../common/config').port;
Zombie.site = `http://localhost:${port}`;
const browser = new Zombie();
const screenshots = require('./screenshots');
const GoogleTagManagerHelper = require('../../common/page_objects/google-tag-manager-helper');
const expect = require('chai').expect;
const { describe, it, before, after } = require('mocha');
const MainPage = require('../../common/page_objects/main-page');
const ErrorPage = require('../../common/page_objects/error-page');
const CookiePage = require('../../common/page_objects/cookie-page');
const IntroductionPage = require('../../common/page_objects/introduction-page');
const SearchPage = require('../../common/page_objects/search-page');
const OccupationPage = require('../../common/page_objects/occupation-page');
const Routes = require('./routes');
const routes = new Routes(basePath, Zombie.site);
const mock = require('../../common/mocks');

process.env.GOOGLE_TAG_MANAGER_ID = 'fake-id';
process.env.PORT = port;
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
const app = require('../../../bin/www');

afterEach(function () {
  if (this.currentTest.state === 'failed') {
    screenshots.takeScreenshot(this.currentTest, browser);
  }
});

module.exports = {
  browser,
  googleTagManagerHelper: new GoogleTagManagerHelper(browser),
  mainPage: new MainPage(browser, routes),
  errorPage: new ErrorPage(browser, routes),
  cookiePage: new CookiePage(browser, routes),
  introductionPage: new IntroductionPage(browser, routes),
  searchPage: new SearchPage(browser, routes),
  occupationPage: new OccupationPage(browser, routes),
  mock,
  app,
  expect,
  describe,
  it,
  before,
  after,
  routes,
  basePath,
};
