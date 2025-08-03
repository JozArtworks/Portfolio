import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailToastComponent } from './mail-toast.component';

describe('MailToastComponent', () => {
  let component: MailToastComponent;
  let fixture: ComponentFixture<MailToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailToastComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MailToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
