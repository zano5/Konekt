import { TestBed } from '@angular/core/testing';

import { PostOpportunityService } from './post-opportunity.service';

describe('PostOpportunityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostOpportunityService = TestBed.get(PostOpportunityService);
    expect(service).toBeTruthy();
  });
});
