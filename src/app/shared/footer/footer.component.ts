import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinksImgComponent } from "../components/links-img/links-img.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LinksImgComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {}
