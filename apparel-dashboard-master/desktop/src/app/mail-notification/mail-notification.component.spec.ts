import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMailComponent } from './mail-notification.component';

describe('GroupMailComponent', () => {
  let component: GroupMailComponent;
  let fixture: ComponentFixture<GroupMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
