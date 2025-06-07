import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePopoutComponent } from './mobile-popout.component';

describe('MobilePopoutComponent', () => {
  let component: MobilePopoutComponent;
  let fixture: ComponentFixture<MobilePopoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobilePopoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobilePopoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
