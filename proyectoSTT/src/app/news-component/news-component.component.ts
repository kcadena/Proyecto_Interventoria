import { Component, OnInit } from '@angular/core';
import { ServiciosGlobales } from '../services/servicios-globales';
import { Servicios } from '../services/servicios';
import { RemarksComponent } from '../modulo_actividades/remarks/remarks.component';

@Component({
	selector: 'app-news-component',
	templateUrl: './news-component.component.html',
	styleUrls: ['./news-component.component.css']

})
export class NewsComponentComponent implements OnInit {
	novedades: any;
	novedad: any;
	archivos: any;
	cad: string = '';
	tipo: string = "img";
	constructor(private serviciog: ServiciosGlobales,
		private servicios: Servicios) { }

	ngOnInit() {
		console.log(this.serviciog.usuario);
		var formData = new FormData();
		formData.append("id_usuario", this.serviciog.usuario.id_usuario + "");
		this.servicios.getDataNovedades(formData)
			.then(novedades => {
				if (novedades) {
					console.log(novedades);
					this.novedades = novedades;
				}
			});
	}

	getMultimediaNovedad(novedad) {
		this.novedad = novedad;
		this.getArchivo();
	}
	cambio($event) {
		this.getArchivo();
	}
<<<<<<< HEAD

	getArchivo() {
		this.archivos = [];
		var formData = new FormData();

		formData.append('keym', this.novedad.keym);
		formData.append('id_caracteristica', this.novedad.id_caracteristica);
		formData.append('id_usuario', this.novedad.id_usuario);
		formData.append('tipo', this.tipo);

		this.servicios.getFilesNovedades(formData)
			.then(archivos => {
				if (archivos) {
					this.archivos = archivos
				}
			})

	}

	approvalPercentage(novedad: any, state: boolean) {
		this.novedad = novedad;
		var formData = new FormData();
		novedad.stateApproval = state;
		formData.append('novedad', JSON.stringify(novedad));
		this.servicios.approvalPercentage(formData)
			.then(message => {
				for (var i=0; i<this.novedades.length; i++)
				{
					if (this.novedades[i].keym == this.novedad.keym &&
						this.novedades[i].id_caracteristica == this.novedad.id_caracteristica &&
						this.novedades[i].id_usuario == this.novedad.id_usuario)
					{
						this.novedades.splice(i,1);
						return this.novedades;
					}
				}
			})
	}

	regMarkNovedad() {

		//alert(this.serviciog.usuario.id_usuario+'-'+this.cad);
		var dat = {
			keym: this.novedad.keym,
			id_caracteristica: this.novedad.id_caracteristica,
			id_usuario: this.novedad.id_usuario,
			usu_observacion: this.serviciog.usuario.id_usuario,
			observacion: this.cad
		};
		//alert(JSON.stringify(dat)+'-'+this.serviciog.usuario.id_usuario+'-'+this.cad);
		var formData = new FormData();
		formData.append("remark", JSON.stringify(dat));

		this.servicios.regRemarks(formData)
			.then(message => {
				//alert(JSON.stringify(message));
				for (var i=0; i<this.novedades.length; i++)
				{
					if (this.novedades[i].keym == this.novedad.keym &&
						this.novedades[i].id_caracteristica == this.novedad.id_caracteristica &&
						this.novedades[i].id_usuario == this.novedad.id_usuario)
					{
						this.novedades.splice(i,1);
						return this.novedades;
					}
				}
				//this.serviGloAct.remarks = message;
			})
	}

=======
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
>>>>>>> 42f95b26cac29f1807329e4e0aad495793c5ccc6
}
