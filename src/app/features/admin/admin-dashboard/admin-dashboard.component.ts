import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/services/dashboard.service';
import { DashboardStats } from '../../../core/services/models/dashboard-stats';
import { Chart, registerables } from 'chart.js';
import { ChartData, ChartType } from 'chart.js';
import { NgForOf, NgIf } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

// ✅ Register Chart.js components globally
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgForOf, NgIf, BaseChartDirective],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  skillsChartData: ChartData<'doughnut'> = { labels: [], datasets: [{ data: [], backgroundColor: [] }] };
  skillsChartType: ChartType = 'doughnut';

  userChartData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Missions', backgroundColor: '#36A2EB' }] };
  userChartType: ChartType = 'bar';

  monthChartData: ChartData<'line'> = { labels: [], datasets: [{ data: [], label: 'Missions', backgroundColor: '#FFCE56', borderColor: '#FFCE56', fill: false }] };
  monthChartType: ChartType = 'line';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe(stats => {
      this.stats = stats;

      if (stats.missionsBySkill) {
        this.skillsChartData.labels = Object.keys(stats.missionsBySkill);
        this.skillsChartData.datasets[0].data = Object.values(stats.missionsBySkill);
        this.skillsChartData.datasets[0].backgroundColor = ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40'];
      }

      if (stats.missionsByUser) {
        this.userChartData.labels = Object.keys(stats.missionsByUser);
        this.userChartData.datasets[0].data = Object.values(stats.missionsByUser);
      }

      if (stats.missionsByMonth) {
        this.monthChartData.labels = Object.keys(stats.missionsByMonth);
        this.monthChartData.datasets[0].data = Object.values(stats.missionsByMonth);
      }
    });
  }
}
