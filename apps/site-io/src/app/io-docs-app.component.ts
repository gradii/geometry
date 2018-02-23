import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import { DocumentationItems } from './shared/documentation-items/documentation-items';

const SMALL_WIDTH_BREAKPOINT = 840;

@Component({
  selector           : 'io-docs-app',
  preserveWhitespaces: false,
  encapsulation      : ViewEncapsulation.None,
  templateUrl        : './io-docs-app.html',
  styleUrls          : ['./io-docs-app.scss'],
})
export class IoDocsAppComponent implements OnInit {
  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  componentList = [];
  searchComponent = null;
  versionList = ['0.5.x', '0.6.x'];
  currentVersion = '0.6.x';


  constructor(public docItems: DocumentationItems,
              private router: Router,
              private ngZone: NgZone) {
    this.mediaMatcher.addListener(mql => ngZone.run(() => this.mediaMatcher = mql));

    let previousRoute = router.routerState.snapshot.url;
    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((data: NavigationEnd) => {
        // We want to reset the scroll position on navigation except when navigating within
        // the documentation for a single component.
        if (!isNavigationWithinComponentView(previousRoute, data.urlAfterRedirects)) {
          resetScrollPosition();
        }

        previousRoute = data.urlAfterRedirects;
      });
  }

  navigateToPage(url) {
    if (url) {
      this.router.navigateByUrl(url);
    }
  }

  navigateToVersion(version) {
    if (version !== this.currentVersion) {
      window.location.href = window.location.origin + `/version/` + version;
    } else {
      window.location.href = window.location.origin;
    }
  }

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }

  ngOnInit() {
    this.componentList = this.docItems.getAllItems();

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     const currentDemoComponent = this.componentList.find(component => `/${component.path}` === this.router.url);
    //     if (currentDemoComponent) {
    //       this.title.setTitle(`${currentDemoComponent.zh} ${currentDemoComponent.label} - NG-ZORRO`);
    //     }
    //     const currentIntroComponent = this.routerList.intro.find(component => `/${component.path}` === this.router.url);
    //     if (currentIntroComponent) {
    //       this.title.setTitle(`${currentIntroComponent.label} - NG-ZORRO`);
    //     }
    //     if (this.router.url !== '/' + this.searchComponent) {
    //       this.searchComponent = null;
    //     }
    //     window.scrollTo(0, 0);
    //   }
    // });

    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        // this.menu.hidden();
      }
    });
  }
}

function isNavigationWithinComponentView(oldUrl: string, newUrl: string) {
  const componentViewExpression = /components\/(\w+)/;
  return oldUrl && newUrl
    && componentViewExpression.test(oldUrl)
    && componentViewExpression.test(newUrl)
    && oldUrl.match(componentViewExpression)[1] === newUrl.match(componentViewExpression)[1];
}

function resetScrollPosition() {
  if (typeof document === 'object' && document) {
    const sidenavContent = document.querySelector('.mat-drawer-content');
    if (sidenavContent) {
      sidenavContent.scrollTop = 0;
    }
  }
}
