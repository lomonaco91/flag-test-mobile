import { urlBaseAlpha } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  alphaCountry: any;
  flagCountry: any;
  objCountry: any;

  constructor(private route: ActivatedRoute,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private http: HttpClient,
    public router: Router
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {

    this.presentLoading();

    this.route.queryParams.subscribe(res => {
      console.log('Dados do país: ', res);
      let auxTool = res.infosCountry.split('***');
      this.flagCountry = auxTool[1];
      this.alphaCountry = auxTool[0];

      this.http.get(urlBaseAlpha + this.alphaCountry).subscribe((resultCt: any) => {
        this.closeLoading();
        this.objCountry = resultCt;
        console.log('Details -> ', resultCt);
      }, (e: any) => {
        console.error('Error get alpha', e);
        this.closeLoading();
        this.presentToast('Não foi possível detalhar as informações do país.');

        setTimeout(() => {
          this.router.navigateByUrl('/home');
        }, 2750);

      });

    });

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

  voltar() {
    this.router.navigateByUrl('/home');
  }

}
