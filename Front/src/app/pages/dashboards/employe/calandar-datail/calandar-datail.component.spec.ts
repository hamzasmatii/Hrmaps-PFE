import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalandarDatailComponent } from './calandar-datail.component';

describe('CalandarDatailComponent', () => {
  let component: CalandarDatailComponent;
  let fixture: ComponentFixture<CalandarDatailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalandarDatailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalandarDatailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
