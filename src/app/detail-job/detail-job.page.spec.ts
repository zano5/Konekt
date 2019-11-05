import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailJobPage } from './detail-job.page';

describe('DetailJobPage', () => {
  let component: DetailJobPage;
  let fixture: ComponentFixture<DetailJobPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailJobPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailJobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
