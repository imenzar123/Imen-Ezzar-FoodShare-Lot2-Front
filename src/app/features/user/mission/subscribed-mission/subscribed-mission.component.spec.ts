import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribedMissionComponent } from './subscribed-mission.component';

describe('SubscribedMissionComponent', () => {
  let component: SubscribedMissionComponent;
  let fixture: ComponentFixture<SubscribedMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribedMissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribedMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
