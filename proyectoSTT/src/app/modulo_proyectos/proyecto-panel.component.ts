import { Component, OnInit}  from '@angular/core';
import { NgModule } 		 from '@angular/core';
import { Router }            from '@angular/router';
import { ServiciosGlobales } from '../services/servicios-globales';
import { Servicios }         from '../services/servicios';

@Component({
	selector: 'proyecto-panel',
	templateUrl: './proyecto-panel.component.html',
	styleUrls: [ './proyecto-panel.component.css' ]
})

export class ProyectoPanel implements OnInit{

	projectList : any = [];

	constructor(
		private serviciog:ServiciosGlobales,
		private router:Router,
		private servicios: Servicios	  
		){ };

	ngOnInit():void { 
		if(this.serviciog.usuario.tipo_usuario === 'sup' || [4,7].indexOf(this.serviciog.usuario.id_usuario) ){
			this.servicios.getProyecto( [5 , this.serviciog.usuario.id_usuario ] + '')
			.then(cadena => {
				this.serviciog.proyecto = cadena;
				this.projectList = cadena;
			});
		}
		else if(this.serviciog.usuario){
			this.servicios.getProyecto(this.serviciog.usuario.id_usuario + '')
			.then(cadena => {
				this.serviciog.proyecto = cadena
				this.projectList = cadena;
			});
		}
	}	

	entrar(proyect:any){
		this.serviciog.proyecto = proyect;		
		let link = ['actividades'];
		this.router.navigate(link);
	}

	btnSearchPrj(value : string){
		//alert(JSON.stringify(this.serviciog.proyecto));
		this.projectList = this.serviciog.proyecto.filter(item  => {
				return (item.nom_pro + item.descripcion).toLowerCase().replace(/ /g,'').indexOf(value.replace(/ /g,'').toLowerCase()) !== -1;
			});
	}
}