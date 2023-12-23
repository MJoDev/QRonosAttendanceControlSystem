import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnualComponent } from './anual.component';

describe('AnualComponent', () => {
  let component: AnualComponent;
  let fixture: ComponentFixture<AnualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnualComponent]
    });
    fixture = TestBed.createComponent(AnualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
