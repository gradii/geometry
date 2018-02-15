import { TriangleExampleModule, TriangleBundleModule } from '@gradii/triangle-examples';
import { TriDataTableModule } from '@gradii/triangle/data-table';
import { MESSAGE_CONFIG, MessageService, NOTIFICATION_CONFIG, NotificationService } from '@gradii/triangle/message';
import { ROOT_CONFIG } from '@gradii/triangle/root';
import { TRI_LOGGER_STATE } from '@gradii/triangle/util';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routing.module';
import { DemoCodeBoxModule } from './share/demo-codebox/demo-codebox.module';
import { DemoHighlightModule } from './share/demo-highlight/demo-highlight.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,

    TriangleBundleModule,

    TriDataTableModule,
    TriangleExampleModule,

    DemoCodeBoxModule,
    DemoHighlightModule,
    RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  providers: [
    NotificationService,
    MessageService,
    { provide: TRI_LOGGER_STATE, useValue: true },
    { provide: MESSAGE_CONFIG, useValue: { duration: 3000 } },
    { provide: NOTIFICATION_CONFIG, useValue: { top: '20px' } },
    { provide: ROOT_CONFIG, useValue: { extraFontName: 'anticon', extraFontUrl: './assets/fonts/iconfont' } },
    // { provide: TRI_LOCALE, useValue: enUS },
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
