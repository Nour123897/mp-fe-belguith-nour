import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  actions:Array<any>=[
    { titre: 'Accueil', route: '/accueil', icone: 'bi bi-house' },
    { titre: 'Liste des produits', route: '/produits', icone: 'bi bi-list' },
    { titre: 'Ajouter Produit', route: '/ajouterProduit', icone: 'bi bi-plus' },
  ]
  actionCourante:any;
  setActionCourante(a :any)
  {
    this.actionCourante=a;
  }
}
