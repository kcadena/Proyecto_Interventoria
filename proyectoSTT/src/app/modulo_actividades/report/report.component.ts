import { Component, OnInit, Input } from "@angular/core";
import { NgModule } from "@angular/core";

import { Router } from "@angular/router";
import { ServiciosGlobales } from "../../services/servicios-globales";
import { ServiciosGlobalesActividades } from "../servicios-globales-actividades";
import { Servicios } from "../../services/servicios";


@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

	@Input() doughnutChartData: string[] = [];
	@Input() doughnutChartLabels: number[] = [];
	@Input() doughnutChartType: any = '';
	@Input() etapa: string = '';
	@Input() tipo: string = '';
	@Input() isTitleSelected : boolean = false;

	constructor(
		private serviciog: ServiciosGlobales,
		private serviGloAct: ServiciosGlobalesActividades,
		private router: Router,
		private servicios: Servicios
		) {}

	ngOnInit() {
	} 

}
