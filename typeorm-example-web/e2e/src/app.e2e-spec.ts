/**
 * アプリのe2eテスト。
 * @module ./app.e2e-spec
 */
import { AppPage } from './app.po';

describe('Exaple App', () => {
	let page: AppPage;

	beforeEach(() => {
		page = new AppPage();
	});

	it('should display top page', () => {
		page.navigateTo();
		expect(page.getHeaderTitle()).toEqual('TypeORM Blog Example');
	});
});
