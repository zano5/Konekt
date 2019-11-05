import { TestBed } from '@angular/core/testing';

import { PostJobService } from './post-job.service';

describe('PostJobService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostJobService = TestBed.get(PostJobService);
    expect(service).toBeTruthy();
  });
});
