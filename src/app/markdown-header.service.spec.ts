import { TestBed } from '@angular/core/testing';

import { MarkdownHeaderService } from './markdown-header.service';

describe('MarkdownHeaderService', () => {
  let service: MarkdownHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkdownHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
