import { TestBed } from '@angular/core/testing';

import { AunthenticationService } from './aunthentication.service';

describe('AunthenticationService', () => {
  let service: AunthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AunthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
