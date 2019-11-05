import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpViewPage } from './op-view.page';

describe('OpViewPage', () => {
  let component: OpViewPage;
  let fixture: ComponentFixture<OpViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
