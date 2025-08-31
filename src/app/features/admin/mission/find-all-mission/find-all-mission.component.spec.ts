import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindAllMissionComponent } from './find-all-mission.component';

describe('FindAllMissionComponent', () => {
  let component: FindAllMissionComponent;
  let fixture: ComponentFixture<FindAllMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindAllMissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindAllMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
