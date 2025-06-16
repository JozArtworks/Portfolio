import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/footer/footer.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FooterComponent, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    message: '',
    privacyAccepted: false,
    honeypot: ''
  };

  success = false;
  error = false;
  isSending = false;


  submitForm() {
    this.isSending = true;

    const formData = new FormData();
    formData.append('name', this.formData.name);
    formData.append('email', this.formData.email);
    formData.append('message', this.formData.message);
    formData.append('honeypot', this.formData.honeypot);


    fetch('/mail.php', {
      method: 'POST',
      body: formData
    })
      .then(res => {
        if (res.ok) {
          this.success = true;
          this.error = false;
          this.isSending = false;



          this.formData = {
            name: '',
            email: '',
            message: '',
            privacyAccepted: false,
            honeypot: ''
          };

          setTimeout(() => {
            this.success = false;
          }, 4000);
        } else {
          this.error = true;
          this.success = false;
          console.error('Senden fehlgeschlagen');
        }
      })
      .catch(err => {
        this.error = true;
        this.success = false;
        this.isSending = false;

        console.error('Netzwerkfehler:', err);
        alert('Fehler beim Versenden der Nachricht.');
      });

  }
}

