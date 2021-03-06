const helper = require('./support/integrationSpecHelper');
const nock = require('nock');
const googleTagManagerHelper = helper.googleTagManagerHelper;
const searchPage = helper.searchPage;
const resultsPage = helper.resultsPage;
const expect = helper.expect;
const before = helper.before;
const after = helper.after;
const it = helper.it;
const describe = helper.describe;
const routes = helper.routes;
const breadcrumb = helper.breadcrumbBuilder;

describe('Search', () => {
  const accountId = '109c346f-e64e-4bb5-9749-28dbbdfdfe55';

  describe('new search', () => {
    before(() => searchPage.visit(accountId));

    it('should contain valid google tag manager data', () =>
      expect(googleTagManagerHelper.getUserVariable()).to.equal('set-me-in-controller')
    );

    it('should display search examples', () =>
      expect(searchPage.getText()).to.contain('e.g.')
    );

    describe('breadcrumb', () => {
      it('should show breadcrumb on the search page', () => {
        expect(searchPage.getBreadcrumbs()).to.eql([
          breadcrumb('Introduction', routes.introductionUrl({ accountId })),
          breadcrumb('Search'),
        ]);
      });
    });
  });

  describe('no results', () => {
    before(() => resultsPage.visit(accountId, ''));

    it('should contain valid google tag manager data', () =>
      expect(googleTagManagerHelper.getUserVariable()).to.equal('set-me-in-controller')
    );

    it('should display search examples', () =>
      expect(resultsPage.getText()).to.contain('e.g.')
    );

    describe('breadcrumb', () => {
      it('should show breadcrumb on the search page', () => {
        expect(resultsPage.getBreadcrumbs()).to.eql([
          breadcrumb('Introduction', routes.introductionUrl({ accountId })),
          breadcrumb('Search', routes.searchUrl({ accountId })),
          breadcrumb('Results'),
        ]);
      });
    });
  });

  describe('results', () => {
    before(() => {
      this.mockSearchQuery = 'MockedRetail';
      this.mockedResponse = [
        { title: 'job title 1', description: 'a job description', soc: 1234 },
        { title: 'job title 2', description: 'another job description', soc: 1234 },
      ];
      if (!nock.isActive()) {
        nock.activate();
      }
      nock('https://api.lmiforall.org.uk', { allowUnmocked: true })
        .get('/api/v1/soc/search')
        .query({
          q: this.mockSearchQuery,
        })
        .reply(200, this.mockedResponse);
      return resultsPage.visit(accountId, 'MockedRetail');
    });
    after(() => nock.restore());

    it('should not display search examples', () =>
      expect(resultsPage.getText()).not.to.contain('e.g.')
    );

    it('should display search results, descriptions and links', () =>
      expect(resultsPage.getResults()).to.eql(this.mockedResponse.map(r => ({
        title: r.title,
        description: r.description,
        href: routes.occupationUrl({ accountId, socCode: r.soc, fromQuery: this.mockSearchQuery }),
      })))
    );

    describe('breadcrumb', () => {
      it('should show breadcrumb on the search page', () => {
        expect(resultsPage.getBreadcrumbs()).to.eql([
          breadcrumb('Introduction', routes.introductionUrl({ accountId })),
          breadcrumb('Search', routes.searchUrl({ accountId })),
          breadcrumb('Results'),
        ]);
      });
    });
  });
});
