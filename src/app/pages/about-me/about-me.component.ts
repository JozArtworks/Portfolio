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
    '"Mein Handwerk beginnt dort, wo Funktion auf Bedeutung trifft."',
    '"Design ist für mich kein Stil. Es ist Haltung. Genau wie sauberer Code."',
    '"Mein Stack? HTML, CSS, TypeScript – und eine Prise Intuition."',
    '"Erlebnisse entstehen, wenn Gestaltung führt und Technik trägt."',
    '"Ein gutes Frontend beginnt nicht beim Layout, sondern bei der Entscheidung, was wirklich gebraucht wird."',
    '"Sauberer Code ist kein Ziel – er ist die Voraussetzung für alles, was danach kommt."',
    '"Verantwortung im Code zeigt sich nicht in Features – sondern in den Fehlern, die vermieden wurden."',
    '"Gutes Frontend ist, wenn sich niemand fragt, wie es funktioniert – weil es einfach funktioniert."',
    '"Daten fließen, Layouts folgen – der Rest ist Fokus."',
    '"Frontend ist Systemdenken – und jede Zeile Code formt Vertrauen."',
    '"Was verständlich ist im Code, bleibt erfassbar im Interface."',
    '"Gute Architektur führt nicht nur den Nutzer – sondern auch den Entwickler von morgen."',
    '"Ich glaube an Code, der nicht nur funktioniert – sondern auch lesbar bleibt."'
  ];

  currentSlogan = this.slogans[0];
  sloganIndex = 0;
  animationState: 'visible' | 'hidden' = 'visible';

  ngOnInit(): void {
    setInterval(() => {
      this.animationState = 'hidden';


      setTimeout(() => {
        this.sloganIndex = (this.sloganIndex + 1) % this.slogans.length;
        this.currentSlogan = this.slogans[this.sloganIndex];
        this.animationState = 'visible';

        
      }, 400);
    }, 7000);
  }
}
