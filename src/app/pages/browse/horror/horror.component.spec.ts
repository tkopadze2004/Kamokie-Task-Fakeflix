import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorrorComponent } from './horror.component';

describe('HorrorComponent', () => {
  let component: HorrorComponent;
  let fixture: ComponentFixture<HorrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
