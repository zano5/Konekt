import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailOpportunityPage } from './detail-opportunity.page';

describe('DetailOpportunityPage', () => {
  let component: DetailOpportunityPage;
  let fixture: ComponentFixture<DetailOpportunityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailOpportunityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailOpportunityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
