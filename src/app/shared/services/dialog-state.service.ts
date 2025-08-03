import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DialogStateService {
  dialogOpen = signal(false);
}
