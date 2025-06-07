import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksImgComponent } from './links-img.component';

describe('LinksImgComponent', () => {
  let component: LinksImgComponent;
  let fixture: ComponentFixture<LinksImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinksImgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinksImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
