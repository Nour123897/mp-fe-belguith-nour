import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ProduitsService } from '../services/produits.service';
import { Router } from '@angular/router';
import { Categorie } from '../model/categorie';
import { Produit } from '../model/produit';

@Component({
  selector: 'app-produits',  // Assurez-vous que le sélecteur est correct
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produitCourant: Produit = new Produit();
  enEdition = false;
  produits: Produit[] = [];
  categ:Categorie[]=[];

  constructor(
    private produitsService: ProduitsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log("Initialisation du composant...");
    this.consulterProduits();
    this.produitsService.getCategorie().subscribe((data: Categorie[]) => {
      this.categ = data;
      console.log(this.categ);
    })
  }

  editerProduit(p: Produit) {
    this.produitCourant = { ...p };
    console.log('produitCourant après édition :', this.produitCourant);
    this.enEdition = true;
  }
   supprimerProduit(id: number) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
    if (confirmation) {
      this.produitsService.deleteProduit(id)
        .subscribe({
          next: () => {
            console.log("Succès DELETE");
            this.produits = this.produits.filter(p => p.id !== id);
            console.log("Suppression du produit avec l'id: " + id);
          },
          error: err => {
            console.log("Erreur DELETE", err);
          }
        });
    }
  }

  consulterProduits() {
    console.log("Récupérer la liste des produits");
    this.produitsService.getProduits()
      .subscribe({
        next: data => {
          console.log("Succès GET");
          this.produits = data;
        },
        error: err => {
          console.log("Erreur GET", err);
        }
      });
  }

  validerFormulaire(form: NgForm) {
    console.log(form.value);

    if (form.value.id !== undefined) {
      console.log("id non vide...");
      let nouveau = true;
      let index = 0;

      do {
        let p = this.produits[index];

        if (p.id === form.value.id) {
          nouveau = false;
          console.log('ancien');
          let reponse = confirm("Produit existant. Confirmez-vous la mise à jour de :" + p.designation + " ?");

          if (reponse) {
            this.mettreAJourProduit(form.value, p);
            this.enEdition = false; // Cacher le formulaire après validation
          } else {
            console.log("Mise à jour annulée");
          }

          return;
        } else {
          index++;
        }
      } while (nouveau && index < this.produits.length);

      if (nouveau) {
        console.log('nouveau');
        this.produits.push(form.value);
        console.log("Ajout d'un nouveau produit:" + form.value.designation);
      }
    } else {
      console.log("id vide...");
    }
  }

  mettreAJourProduit(nouveau: Produit, ancien: Produit) {
    let reponse = confirm("Produit existant. Confirmez-vous la mise à jour de :" + ancien.designation + " ?");

    if (reponse) {
      this.produitsService.updateProduit(ancien.id, nouveau)
        .subscribe({
          next: updatedProduit => {
            console.log("Succès PUT");
            Object.assign(ancien, updatedProduit);
            console.log('Mise à jour du produit:' + ancien.designation);
            this.enEdition = false; // Cacher le formulaire après validation
          },
          error: err => {
            console.log("Erreur PUT", err);
          }
        });
    } else {
      console.log("Mise à jour annulée");
    }
  }


  effacerSaisie() {
    this.produitCourant = new Produit();
    this.enEdition = false;
  }

  ajouterProduit() {
    this.router.navigate(['/ajout-produit']);
  }
}