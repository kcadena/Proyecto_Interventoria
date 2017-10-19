import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';
import { PersistenceService, StorageType } from 'angular-persistence';
import * as io from 'socket.io-client';


@Injectable()
export class ServiciosGlobales {

	//datos para grafica total de beneficiarios por categorias mapa
	public colors: any[] = [];
	color : string [] = [];
	public labels: string[] = [];
	public data: number[] = [];
	public types: string = "doughnut";
	
	
	messageList: any[] = [];	//Tiene la lista discriminada de cuales son las novedades
	totalMessage: number = 0;	//Muestra en la campana el total de novedaeds
	
	http_str :string ='http://';
	

	tree_name: string[] = [];
	listDatChart: any[] = [];
	remarks: any = [];
	usuario: Usuario;
	proyecto: any;
	actividad: any;
	actividades: any;
	titulo: string;
	isSelAct: boolean = false;
	servidor: string = "http://localhost:81/";// URL to web api api/heroes http://10.42.0.1:81  10.0.0.64 http:///knower.udenar.edu.co:81
	isSubActivity: any;
	tipo: string = 'img';
	axActividades: any;

	/* variables del soket */
	socket = io.connect(this.servidor);
	/* ---------------------------- */
 
	tipos_act = ['Proyecto', 'Proyecto', 'Provincia', 'Municipio', 'Resguardo', 'Beneficiario', 'Capitulo', 'Actividad'];

	constructor(private persistenceService: PersistenceService) { }

	getUserSession(usuario: Usuario) {
		this.persistenceService.set('user', usuario, { type: StorageType.SESSION });
		this.usuario = usuario;
	}

	imagenes: imagen[] = [

	]

}

interface imagen {
	titulo: string;
	subtitulo: string;
	url: string;
	isViewMap: boolean;
}