import { Component, OnInit } from '@angular/core';
import { ServiciosGlobales } from '../services/servicios-globales';
import { Servicios }         from '../services/servicios';

@Component({
	selector: 'app-news-component',
	templateUrl: './news-component.component.html',
	styleUrls: ['./news-component.component.css']
})
export class NewsComponentComponent implements OnInit {
	novedades:any;
	novedad:any;
	archivos:any;
	tipo:string="img";
	constructor(private serviciog:ServiciosGlobales,
		private servicios: Servicios) { }

	ngOnInit() {
		console.log(this.serviciog.usuario);
		var formData = new FormData();
		formData.append("id_usuario",this.serviciog.usuario.id_usuario + "");
		this.servicios.getDataNovedades(formData)
		.then(novedades =>{
			if(novedades){
				console.log(novedades);
				this.novedades = novedades;
			}
		});
	}

	getMultimediaNovedad(novedad){
		this.novedad = novedad;		
	    this.getArchivo();
	}
	cambio($event){
 		this.getArchivo();
 	}

 	getArchivo(){
 		this.archivos=[];
 		var formData = new FormData();

 		formData.append('keym',this.novedad.keym);
 		formData.append('id_caracteristica',this.novedad.id_caracteristica);
 		formData.append('id_usuario',this.novedad.id_usuario);
 		formData.append('tipo',this.tipo);

 		this.servicios.getMultimedia(formData)
 		.then(archivos => {
 			if(archivos){
 				this.archivos = archivos
 			}
 		});
 	}

 	public testMetod(){
		alert("Funciona!!!!!");	
	}
}
