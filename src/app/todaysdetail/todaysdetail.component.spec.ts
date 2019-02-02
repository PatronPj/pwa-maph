import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysdetailComponent } from './todaysdetail.component';

describe('TodaysdetailComponent', () => {
  let component: TodaysdetailComponent;
  let fixture: ComponentFixture<TodaysdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodaysdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaysdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
