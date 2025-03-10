import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TanquesPage } from './tanques.page';

describe('TanquesPage', () => {
  let component: TanquesPage;
  let fixture: ComponentFixture<TanquesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TanquesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
