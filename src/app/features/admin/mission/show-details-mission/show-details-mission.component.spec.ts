import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDetailsMissionComponent } from './show-details-mission.component';

describe('ShowDetailsMissionComponent', () => {
  let component: ShowDetailsMissionComponent;
  let fixture: ComponentFixture<ShowDetailsMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowDetailsMissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowDetailsMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
