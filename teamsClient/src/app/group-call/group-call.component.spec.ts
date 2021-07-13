import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCallComponent } from './group-call.component';

describe('GroupCallComponent', () => {
  let component: GroupCallComponent;
  let fixture: ComponentFixture<GroupCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupCallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
