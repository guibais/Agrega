import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAddPage } from './event-add.page';

describe('EventAddPage', () => {
  let component: EventAddPage;
  let fixture: ComponentFixture<EventAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
