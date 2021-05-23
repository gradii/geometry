/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title menu-vertical
 */
@Component({
  selector: 'tri-demo-menu-data-source',
  template: `
    <tri-menu [mode]="'inline'" style="width: 240px;"
        [dataSource]="menuItems"
    >
      <!-- <li tri-submenu>
         <span title><i class="anticon anticon-mail"></i> Navigation One</span>
         <ul>
           <li tri-menu-group>
             <span title>Item 1</span>
             <ul>
               <li tri-menu-item>Option 1</li>
               <li tri-menu-item>Option 2</li>
             </ul>
           </li>
           <li tri-menu-group>
             <span title>Item 2</span>
             <ul>
               <li tri-menu-item>Option 3</li>
               <li tri-menu-item>Option 4</li>
             </ul>
           </li>
         </ul>
       </li>
       <li tri-submenu>
         <span title><i class="anticon anticon-appstore"></i> Navigation Two</span>
         <ul>
           <li tri-menu-item>Option 5</li>
           <li tri-menu-item>Option 6</li>
           <li tri-submenu>
             <span title>Submenu</span>
             <ul>
               <li tri-menu-item>Option 7</li>
               <li tri-menu-item>Option 8</li>
               <li tri-submenu>
                 <span title>Submenu Nest</span>
                 <ul>
                   <li tri-menu-item>Option 10</li>
                   <li tri-menu-item>Option 11</li>
                 </ul>
               </li>
             </ul>
           </li>
         </ul>
       </li>
       <li tri-submenu>
         <span title><i class="anticon anticon-setting"></i> Navigation Three</span>
         <ul>
           <li tri-menu-item>Option 9</li>
           <li tri-menu-item>Option 10</li>
           <li tri-menu-item>Option 11</li>
         </ul>
       </li>-->
    </tri-menu>`,
  styles  : []
})
export class TriDemoMenuDataSourceComponent implements OnInit {
  menuItems = [
    {
      title   : 'Menu link with parameters 1',
      expanded: true,
      children: [
        {
          title: 'Goes into angular `routerLink`',
          link : '',
        },
        {
          title: 'Goes directly into `href` attribute',
          url  : '/example/menu/menu-link-params.component#some-location',
        },
        {
          title      : 'Menu item path match `prefix`',
          link       : '/example/menu/menu-link-params.component',
          queryParams: {someUrlParam: 'true'},
          pathMatch  : 'prefix',
        },
        {
          title : 'Will be opened in new window (target=`_blank`)',
          url   : 'https://github.com/akveo/nebular',
          target: '_blank',
        },
        {
          title: 'Menu item with icon',
          link : '/example/menu/menu-link-params.component',
          icon : 'outline:search',
        },
        {
          title : 'Hidden menu item',
          link  : '',
          hidden: true,
        },
        {
          title: 'Menu item with icon bell',
          link : '/example/menu/menu-link-params.component',
          icon : 'outline:bell',
          children: [
            {
              title : 'Nested menu item',
              url   : 'https://github.com/akveo/nebular',
              target: '_blank',
              icon : 'outline:mail',
            },
            {
              title: 'Nested menu item with icon',
              link : '/example/menu/menu-link-params.component',
              icon : 'outline:slack',
            },
          ]
        }
      ],
    },
    {
      divider: true,
    },
    {
      title   : 'Menu link with parameters 2',
      expanded: true,
    },
    {
      title   : 'Menu link with parameters 3',
      url     : '/example/menu/help',
      expanded: true,
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }
}
