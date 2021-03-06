import { Component, OnInit } from '@angular/core';
import { DemandeSuppHeure } from '../../../shared/Models/ServiceRh/demande-supp-heure.model';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../../shared/Services/User/user-service.service';
import { DemandeSuppHeureService } from '../../../shared/Services/ServiceRh/demande-supp-heure.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-demande-supp-heure-list',
  templateUrl: './demande-supp-heure-list.component.html',
  styleUrls: ['./demande-supp-heure-list.component.css']
})
export class DemandeSuppHeureListComponent implements OnInit {

  constructor(private suppheureService: DemandeSuppHeureService,
    private toastr: ToastrService,
    private UserService: UserServiceService,) { }

  ngOnInit(): void {
    this.getUserConnected();
    this.getCreance();
    this.resetForm();
  }


  UserIdConnected: string;
  UserNameConnected: string;

  getUserConnected() {

    this.UserService.getUserProfileObservable().subscribe(res => {
      this.UserIdConnected = res.id;
      this.UserNameConnected = res.fullName;

    })

  }


  //editing Facture
  isValidFormSubmitted = false;
  date = new Date().toLocaleDateString();
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.isValidFormSubmitted = false;

    }
    else {

      this.isValidFormSubmitted = true
      this.updateRecord(form)
    }
  }
  //Populate Form 
  factId: number
  fact: DemandeSuppHeure = new DemandeSuppHeure();
  populateForm(facture: DemandeSuppHeure) {
    this.suppheureService.formData = Object.assign({}, facture)
    this.factId = facture.id;
    this.fact = Object.assign({}, facture);
  }

  factList: DemandeSuppHeure[] = [];
  GfactList: DemandeSuppHeure[] = [];
  getCreance() {
    this.suppheureService.Get().subscribe(res => {
      this.GfactList = res;

      this.factList = this.GfactList.filter(item => item.idUserCreator == this.UserIdConnected)
      

    })

  }


  updateRecord(form: NgForm) {

    if (this.suppheureService.formData.etatdir == "???? ????????????????") {
      this.suppheureService.Edit().subscribe(res => {
        this.toastr.success('???? ?????????????? ??????????', '????????')
        this.resetForm();
        this.getCreance();
      },
        err => {
          this.toastr.error(' ???? ?????? ??????????????  ', ' ??????');
        }


      )
  }else{
      this.toastr.error(' ?????????? ?????? ?????????????? ', ' ??????');
}
  }

  //Delete Dotation
  onDelete(Id) {
    if (confirm('Are you sure to delete this record ?')) {
      this.suppheureService.Delete(Id)
        .subscribe(res => {
          this.getCreance();
          this.toastr.success("???? ??????????  ??????????", "????????");
        },

          err => {
            console.log(err);
            this.toastr.warning('???? ?????? ??????????  ', ' ??????');

          }
        )

    }
  }
  resetForm(form?: NgForm) {

    if (form != null)
      form.resetForm();
    this.suppheureService.formData = {
      id: null,
      date: '',
      detail: '',
      nbheure: '',
      username: '',
      idusername: '',
      etat: '',
      etatdir: '',
      datedir: '',
      nomdir: '',
      iddir: '',
      attribut1: null,
      attribut2: '',
      attribut3: '',
      attribut4: '',
      attribut5: '',
      attribut6: '',
      dateenreg: '',
      userNameCreator: '',
      idUserCreator: '',
    }
  }
}
