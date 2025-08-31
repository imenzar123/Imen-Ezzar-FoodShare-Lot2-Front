import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsseignMissionComponent } from './asseign-mission.component';

describe('AsseignMissionComponent', () => {
  let component: AsseignMissionComponent;
  let fixture: ComponentFixture<AsseignMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsseignMissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsseignMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
