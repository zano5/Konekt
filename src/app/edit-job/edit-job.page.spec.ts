import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobPage } from './edit-job.page';

describe('EditJobPage', () => {
  let component: EditJobPage;
  let fixture: ComponentFixture<EditJobPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditJobPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
