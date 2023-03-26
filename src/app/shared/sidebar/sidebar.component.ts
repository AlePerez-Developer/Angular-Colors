import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import * as $ from 'jquery';


declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {

    //$('[data-widget="treeview"]').Treeview('init');
  }

  logout() {
    localStorage.removeItem('auth-token');
    this.router.navigateByUrl('/login');
  }

}
