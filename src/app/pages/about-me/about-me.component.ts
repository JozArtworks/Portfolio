import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {

  slogans = [
    '"Ordnung im Code ist kein Luxus. Es ist Verantwortung."',
    '"Code ist Kommunikation."',
    '"Frontend ist mehr als Technik – es ist Beziehung zum Nutzer."',
    '"Wenn Code fließt, folgt das Design von selbst."',
    '"Frontend ist kein Klickziel – sondern Systemschnittstelle."',
    '"Technik ist kein Stilmittel. Sie ist Verantwortung."',
    '"Der Nutzer sieht’s nicht. Aber der nächste Entwickler schon."',
    '"Mein Stack? HTML, CSS, TypeScript – und eine Prise Intuition."',
    '"Daten fließen, Layouts folgen – der Rest ist Fokus."'
  ];

  currentSlogan = this.slogans[0];
  sloganIndex = 0;
  animationState: 'fade-in' | 'fade-out' = 'fade-in';


  ngOnInit(): void {
    setInterval(() => {
      this.animationState = 'fade-out';
      setTimeout(() => {
        this.sloganIndex = (this.sloganIndex + 1) % this.slogans.length;
        this.currentSlogan = this.slogans[this.sloganIndex];
        this.animationState = 'fade-in';

      }, 400);
    }, 7000);
  }

}
