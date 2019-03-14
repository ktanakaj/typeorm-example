/**
 * ブログサービスのテスト。
 * @module ./app/blogs/blog.service.spec
 */
import { inject } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { BlogService } from './blog.service';

describe('PlayerService', () => {
	beforeEach(() => {
		testHelper.configureTestingModule({
			providers: [BlogService]
		});
	});

	it('should be created', inject([BlogService], (service: BlogService) => {
		expect(service).toBeTruthy();
	}));
});
