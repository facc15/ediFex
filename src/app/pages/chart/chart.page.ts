import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import * as Highcharts from 'highcharts';
const HighchartsMore = require("highcharts/highcharts-more.src");
HighchartsMore(Highcharts);
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
import HC_exportData from 'highcharts/modules/export-data';
HC_exportData(Highcharts);
import ExportingModule from 'highcharts/modules/exporting';
import DownloadingModule from 'highcharts/modules/export-data.js';
import { Data } from 'src/app/interfaces/data';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Photo } from 'src/app/interfaces/photo';

Chart.register(...registerables);
ExportingModule(Highcharts);
DownloadingModule(Highcharts);


@Component({
  selector: 'app-chart',
  templateUrl: './chart.page.html',
  styleUrls: ['./chart.page.scss'],
})
export class ChartPage implements OnInit {

  public chartOptions: any;
  public highcharts=Highcharts;
  @Input() photos: Photo[];
  @Input() firebaseService: FirebaseService;
  @Input() chart: string;

  data: Data;
  datas:Data[]
  constructor() {
    this.data={name:{},data:{},y:0} as Data;
    this.datas=[];
  }

  ngOnInit() {

    this.howManyLikes();

    if(this.chart=='pie')
    {
      this.seePieChart();
    }else if(this.chart=='column')
    {
      this.seeColumnChart();
    }


  }

  deletElementDuplicated(arr:Data[]) {
    const withOutRepeat = [];
    return arr.filter(obj => {
        if (arr.includes(obj)) {
            return false;
        } else {
          withOutRepeat.push(obj);
            return true;
        }
    });
}

  howManyLikes(): Data[] {
    var dataColumn= {name:'',data:new Array()};
    var datas: Data[] = [];
    this.firebaseService.firestoreService.users.forEach((user,i) => {

      const userLikes = this.photos.reduce((totalLikes, foto) => {
        if (foto.uidLikes.includes(user.uid))
        {
          totalLikes++;
        }
        return totalLikes;
      }, 0);

   //pieBar
      const data={name:{},data:new Array(),y:0} as Data;
      data.name= user.email.split('@')[0];

      if(this.chart=='pie')
      data.y= userLikes;
      else if(this.chart=='column')
      data.data[0]=userLikes;

      if(!this.datas.some(dat=>dat.name==data.name))
      {
        this.datas.push(data);
      }

    });

    return datas;
  }

  seeColumnChart(){


    this.chartOptions={
      credits:{
        enabled:false,
      },
      chart:{
        type:'column'
      },
      title:{
        text:'Fotos feas del edificio.'
      },
      xAxis:{
        title:{
          text: 'Fotos feas'
        },
        categories:"",
        crosshair:true,

      },
      yAxis:{
        title:{

          text:'Cantidad de likes'
        }

      },
      series: this.datas,
      exporting: {
        allowHTML: true,

        pdfFont: {
          normal: 'https://www.highcharts.com/samples/data/fonts/NotoSans-Regular.ttf',
          bold: 'https://www.highcharts.com/samples/data/fonts/NotoSans-Bold.ttf',
          bolditalic: 'https://www.highcharts.com/samples/data/fonts/NotoSans-BoldItalic.ttf',
          italic: 'https://www.highcharts.com/samples/data/fonts/NotoSans-Italic.ttf'
      }
      }

    };
  }



  seePieChart()
  {
    this.chartOptions={
      credits:{
        enabled:false,
      },
      chart:{
        type:'pie'
      },
      title:{
        text:'Fotos lindas del edificio'
      },
      xAxis:{
        title:{
          text: 'Usuarios'
        },
        categories:"",
        crosshair:true,

      },
      yAxis:{
        title:{

          text:'Votos'
        }

      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{name:'Votos',data:this.datas}],
      exporting: {
        allowHTML: true,

        pdfFont: {
          normal: 'https://www.highcharts.com/samples/data/fonts/NotoSans-Regular.ttf',
          bold: 'https://www.highcharts.com/samples/data/fonts/NotoSans-Bold.ttf',
          bolditalic: 'https://www.highcharts.com/samples/data/fonts/NotoSans-BoldItalic.ttf',
          italic: 'https://www.highcharts.com/samples/data/fonts/NotoSans-Italic.ttf'
      }
      }

    };

  }

}
