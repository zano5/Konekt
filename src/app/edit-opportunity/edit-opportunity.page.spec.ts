import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOpportunityPage } from './edit-opportunity.page';

describe('EditOpportunityPage', () => {
  let component: EditOpportunityPage;
  let fixture: ComponentFixture<EditOpportunityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOpportunityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOpportunityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
