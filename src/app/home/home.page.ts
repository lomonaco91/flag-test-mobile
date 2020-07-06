import { urlBase } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  regionList: any;
  formData: FormGroup;
  listInfoCountry: any;

  constructor(private http: HttpClient,
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    this.regionList = [
      {
        name: "África",
        idValue: 'africa'
      },
      {
        name: "América",
        idValue: 'americas'
      },
      {
        name: "Ásia",
        idValue: 'asia'
      },
      {
        name: "Europa",
        idValue: 'europe'
      },
      {
        name: "Oceania",
        idValue: 'oceania'
      }
    ];

    // SHOW LOADING
    this.presentLoading();
    setTimeout(() => {
      this.closeLoading();
    }, 1000);

  }

  ionViewWillEnter() {
    this.listInfoCountry = [];
    this.formData.get('region').setValue('');
  }

  createForm() {
    this.formData = this.formBuilder.group({
      region: ['', Validators.required]
    });
  }

  async searchCountries() {

    this.presentLoading();

    let reg = this.formData.get('region').value;
    console.log('região selecionada: ', reg);

    this.listInfoCountry = [];

    this.http.get(urlBase + reg).subscribe((country: any) => {
      console.log('Países: ', country);

      // Lista auxiliar para view
      country.forEach(c => {
        let objCountry = {
          name: null,
          flag: null,
          alpha: null,
          ctId: null
        };

        c.name !== undefined ? objCountry.name = c.name : 'indisponível';
        c.flag !== undefined ? objCountry.flag = c.flag : 'indisponível';
        c.alpha2Code !== undefined ? objCountry.alpha = c.alpha2Code : 'indisponível';
        objCountry.ctId = c.alpha2Code + "***" + c.flag;

        this.listInfoCountry.push(objCountry);
      });

      this.closeLoading();

    }, (e: any) => {
      this.closeLoading();
      this.presentToast('Não foi possível listar os países.')
      console.error('Error', e);
    });
  }

  verMais(info) {
    console.log('Infos --> ', info);
    this.router.navigate(['/detail'], { queryParams: { infosCountry: info.ctId } });
  }


  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Aguarde...',
    });
    await loading.present();
  }

  async closeLoading() {
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 1500);
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
