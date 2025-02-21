import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceEqDetailComponent } from './service-eq-detail.component';

describe('ServiceEqDetailComponent', () => {
  let component: ServiceEqDetailComponent;
  let fixture: ComponentFixture<ServiceEqDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceEqDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceEqDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
