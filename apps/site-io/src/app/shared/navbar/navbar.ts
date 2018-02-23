import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemePickerModule } from '../theme-picker/theme-picker';
import { TriButtonModule } from '@gradii/triangle/button';
import { TriMenuModule } from '@gradii/triangle/menu';

@Component({
  selector   : 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls  : ['./navbar.scss']
})
export class NavBar {}

@NgModule({
  imports     : [
    TriButtonModule,
    TriMenuModule,
    RouterModule,
    ThemePickerModule
  ],
  exports     : [NavBar],
  declarations: [NavBar],
})
export class NavBarModule {}
