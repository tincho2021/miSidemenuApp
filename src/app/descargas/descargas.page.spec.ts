import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescargasPage } from './descargas.page';

describe('DescargasPage', () => {
  let component: DescargasPage;
  let fixture: ComponentFixture<DescargasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DescargasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
