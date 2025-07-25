import { Component } from '@angular/core';
import { FEEDBACKS } from './../../shared/data/feedbacks.data';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss'],
})
export class FeedbacksComponent {
  feedbacks = FEEDBACKS;
}
