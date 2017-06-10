import { LimeproxiesPage } from './app.po';

describe('limeproxies App', () => {
  let page: LimeproxiesPage;

  beforeEach(() => {
    page = new LimeproxiesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
