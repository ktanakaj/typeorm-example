/**
 * ブログ記事サービスのテスト。
 * @module ./app/articles/article.service.spec
 */
import { inject } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { ArticleService } from './article.service';

describe('ArticleService', () => {
	beforeEach(() => {
		testHelper.configureTestingModule({
			providers: [ArticleService]
		});
	});

	it('should be created', inject([ArticleService], (service: ArticleService) => {
		expect(service).toBeTruthy();
	}));
});
