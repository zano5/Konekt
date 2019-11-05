import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitOpportunityPage } from './submit-opportunity.page';

describe('SubmitOpportunityPage', () => {
  let component: SubmitOpportunityPage;
  let fixture: ComponentFixture<SubmitOpportunityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitOpportunityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitOpportunityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
