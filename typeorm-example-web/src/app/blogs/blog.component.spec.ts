/**
 * ブログページコンポーネントのテスト。
 * @module ./app/blogs/blog.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { BlogComponent } from './blog.component';

describe('BlogComponent', () => {
	let component: BlogComponent;
	let fixture: ComponentFixture<BlogComponent>;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [BlogComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
