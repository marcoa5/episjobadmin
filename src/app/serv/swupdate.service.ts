import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { AppupdComponent } from '../comp/util/dialog/appupd/appupd.component';
@Injectable({
  providedIn: 'root'
})
export class SwupdateService {
constructor(private readonly updates: SwUpdate, private dialog: MatDialog) {
  this.updates.available.subscribe(event => {
    this.showAppUpdateAlert();
  });
}
showAppUpdateAlert() {
  const header = 'App Update'
  const message = 'The app has been updated from server. click ok to reload'
  const msg = this.dialog.open(AppupdComponent, {disableClose: true, data: {header: header, message: message}})
  msg.afterClosed().subscribe(o=>{
    if(o) this.doAppUpdate()
  })
}
doAppUpdate() {
    this.updates.activateUpdate().then(() => {
      document.location.reload()
    })
  }
}