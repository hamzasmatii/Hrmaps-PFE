import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceEqComponent } from './service-eq.component';

describe('ServiceEqComponent', () => {
  let component: ServiceEqComponent;
  let fixture: ComponentFixture<ServiceEqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceEqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceEqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
