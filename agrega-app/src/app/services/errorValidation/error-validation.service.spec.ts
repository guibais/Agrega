import { TestBed } from '@angular/core/testing';

import { ErrorValidationService } from './error-validation.service';

describe('ErrorValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErrorValidationService = TestBed.get(ErrorValidationService);
    expect(service).toBeTruthy();
  });
});
