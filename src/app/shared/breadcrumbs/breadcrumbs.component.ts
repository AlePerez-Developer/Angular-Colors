import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators'

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnDestroy {

  public titulo?: string;
  public tituloSub$: Subscription;

  constructor(private router: Router) {
    this.tituloSub$ = this.getArgumentos().subscribe(({ titulo }) => {
      this.titulo = titulo;
      document.title = `Colors - ${titulo}`;
    }) 
  }

  ngOnDestroy(): void {
    this.tituloSub$.unsubscribe();
  }

  getArgumentos() {
    return this.router.events.pipe(
      filter((event: any) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    )
  }


}
