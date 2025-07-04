import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS } from './project-data';

@Component({
  selector: 'app-projekte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects = PROJECTS;
}
