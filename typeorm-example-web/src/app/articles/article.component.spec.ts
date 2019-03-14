/**
 * ブログ記事ページコンポーネントのテスト。
 * @module ./app/articles/article.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { ArticleComponent } from './article.component';

describe('ArticleComponent', () => {
	let component: ArticleComponent;
	let fixture: ComponentFixture<ArticleComponent>;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [ArticleComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ArticleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
