import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobMediaPage } from './post-job-media.page';

describe('PostJobMediaPage', () => {
  let component: PostJobMediaPage;
  let fixture: ComponentFixture<PostJobMediaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJobMediaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
