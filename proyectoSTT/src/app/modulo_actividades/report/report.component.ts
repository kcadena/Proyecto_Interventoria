import { Component, OnInit, Input } from "@angular/core";
import { NgModule } from "@angular/core";
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core'
import { Router } from "@angular/router";
import { ServiciosGlobales } from "../../services/servicios-globales";
import { ServiciosGlobalesActividades } from "../servicios-globales-actividades";
import { Servicios } from "../../services/servicios";
import * as moment from 'moment';

@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

	public today: number = Date.now();


	@Input() doughnutChartData: string[] = [];
	@Input() doughnutChartLabels: number[] = [];
	@Input() doughnutChartType: any = '';

	@Input() isTitleSelected: boolean = false;

	//Falta Juanito
	@Input() etapa: string = '';
	@Input() estado: string = '';
	@Input() color: string = '';
	@Input() nombre: string = '';

	@Input() observaciones: any[] = [];

	//Datos reporte
	@Input() tipo: string = '';
	@Input() beneficiario: string = '';
	@Input() cedula: string = '';
	@Input() provincia: string = '';
	@Input() municipio: string = '';
	@Input() resguardo: string = '';
	@Input() feciniobr: string = '';
	@Input() porcejec: string = '';
	@Input() firmaEla: string = '';
	@Input() nombreEla: string = '';
	@Input() cargoEla: string = '';
	@Input() firmaApr: string = '';
	@Input() nombreApr: string = '';
	@Input() cargoApr: string = '';

	msg: any;

	public chartLabels: string[] = ["EJECUTADO", "NO EJECUTADO"];

	tipNum: number = 0;

	public barColor: any[] = [
		{ backgroundColor: ["rgba(15, 255, 0, 0.8)", "rgba(255, 9, 0, 0.81)"] }
	];


	constructor(
		private serviciog: ServiciosGlobales,
		private serviGloAct: ServiciosGlobalesActividades,
		private router: Router,
		private servicios: Servicios
	) { }

	ngOnInit() {
		this.msg = [];
		this.tipNum = 0;
		this.chartLabels = ["EJECUTADO " + this.porcejec + ' %', "NO EJECUTADO " + (100 - parseFloat(this.porcejec)) + ' %'];

		switch (this.tipo) {
			case 'BENEFICIARIO':
			this.tipNum = 4;
			break;
			case 'RESGUARDO':
			this.tipNum = 3;
			break;
			case 'MUNICIPIO':
			this.tipNum = 2;
			break;
			case 'PROVINCIA':
			this.tipNum = 1;
			break;
		}
	}

	downloadReport() {
		this.msg = {
			"tipo": this.tipo,
			"beneficiario": this.beneficiario,
			"cedula": this.cedula,
			"provincia": this.provincia,
			"municipio": this.municipio,
			"resguardo": this.resguardo,
			"feciniobr": this.feciniobr,
			"porcejec": this.porcejec,
			"firmaEla": this.firmaEla,
			"nombreEla": this.nombreEla,
			"cargoEla": this.cargoEla,
			"firmaApr": this.firmaApr,
			"nombreApr": this.nombreApr,
			"cargoApr": this.cargoApr,
			"nombre": this.nombre,
			"observaciones": this.observaciones
		};
		//alert(JSON.stringify(this.observaciones));
		//generar reporte
		/*var formData = new FormData();
		formData.append("msg", JSON.stringify(this.msg));
		this.servicios.downloadReport(formData).then(message => {
			alert(JSON.stringify(message));
		});*/

		var url;
		url = 'http://localhost:81/downloadReport' + '?val1=' + JSON.stringify(this.msg);
		window.open(url, '_blank');
	}

}
