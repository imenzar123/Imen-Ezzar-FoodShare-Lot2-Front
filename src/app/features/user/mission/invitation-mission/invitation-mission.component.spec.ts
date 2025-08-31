import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationMissionComponent } from './invitation-mission.component';

describe('InvitationMissionComponent', () => {
  let component: InvitationMissionComponent;
  let fixture: ComponentFixture<InvitationMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationMissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
