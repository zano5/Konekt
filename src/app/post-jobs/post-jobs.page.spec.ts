import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobsPage } from './post-jobs.page';

describe('PostJobsPage', () => {
  let component: PostJobsPage;
  let fixture: ComponentFixture<PostJobsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJobsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
