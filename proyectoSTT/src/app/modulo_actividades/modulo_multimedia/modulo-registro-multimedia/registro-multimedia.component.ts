import { Component, ViewChild}  from '@angular/core';
import { NgModule } 		 from '@angular/core';
import { Router }            from '@angular/router';
import { NgForm } 			from '@angular/forms';
import { ServiciosGlobales } from '../../../services/servicios-globales';
import { Servicios }         from '../../../services/servicios';


@Component({
	selector: 'registro-multimedia',
	templateUrl: './registro-multimedia.component.html',
	styleUrls: [ './registro-multimedia.component.css' ]
})

export class RegistroMultimedia{
	
	archivo = new Archivo('','','','','','img');
	files:any;
	imagenName:string = "Cargar Archivo";
	imagenNameValid:string;	
	typesAceptted:string=".jpeg, .jpg, .jpe, .jfif, .jif";
	constructor(
		private serviciog:ServiciosGlobales,
		private router:Router,
		private servicios: Servicios	  
		){ };
	
	
	onSubmitPro(multimediaForm:NgForm) {	
		var formData = new FormData();
		this.archivo.keym = this.serviciog.actividad.keym;
		this.archivo.id_usuario = this.serviciog.actividad.id_usuario;
		this.archivo.id_caracteristica = this.serviciog.actividad.id_caracteristica;

		this.archivo.id_usuario_act = this.serviciog.usuario.id_usuario + '';
		
		//formData.append('id_usuario',JSON.stringify (this.serviciog.usuario.id_usuario));
		formData.append('archivo',JSON.stringify (this.archivo));		

		if(this.files){
			formData.append('file', this.files);
		}		
		this.servicios.createMultimedia(formData)
		.then(message => {			 
			alert("" + message);
			if(message){
				var formData = new FormData();
				//alert(JSON.stringify(this.serviciog.actividad));
				formData.append('keym',this.serviciog.actividad.keym);
				formData.append('id_caracteristica',this.serviciog.actividad.id_caracteristica);
				formData.append('id_usuario',this.serviciog.actividad.id_usuario);
				formData.append('tipo',this.serviciog.tipo);

				this.servicios.getMultimedia(formData)
				.then(imagenes => {
					this.serviciog.imagenes = imagenes;
					//alert(JSON.stringify(imagenes));
				});	
			}
		} );
	}

	imageChangeMult(event){
		this.imagenName = event.target.files[0].name || event.srcElement.files[0].name;
		if(this.archivo.titulo  == ''){
			this.archivo.titulo = this.imagenName;
		}
		this.imagenNameValid = this.imagenName;
		this.files = event.target.files[0] || event.srcElement.files[0];
	}
	
	cambio(){
		if(this.archivo.tipo == "img"){
			this.typesAceptted = ".jpeg, .jpg, .jpe, .jfif, .jif"

		}else if(this.archivo.tipo == "doc"){
			this.typesAceptted = ".docx,.doc,.pdf,.xlsx"

		}else if(this.archivo.tipo == "sou"){
			this.typesAceptted = ".mp3"

		}else if(this.archivo.tipo == "vid"){
			this.typesAceptted = ".mp4"
		}else{
			this.typesAceptted = "*"
		}
		
	}

	multimediaForm: NgForm;

	@ViewChild('multimediaForm') currentForm: NgForm;

	ngAfterViewChecked() {
		this.formChanged();
	}

	formChanged() {
		if (this.currentForm === this.multimediaForm) { return; }
		this.multimediaForm = this.currentForm;
		if (this.multimediaForm) {
			this.multimediaForm.valueChanges
			.subscribe(data => this.onValueChanged(data));
		}
	}

	onValueChanged(data?: any) {
		if (!this.multimediaForm) { return; }
		const form = this.multimediaForm.form;
		
		for (const field in this.formErrors) {

			// clear previous error message (if any)
			this.formErrors[field] = '';
			const control = form.get(field);

			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field] += messages[key] + ' ';
				}
			}
		}
	}

	formErrors = {
		'titulo': '',
		'subtitulo': '',
		'imagen': '',		
	};

	validationMessages = {
		'titulo': {
			'required': 'Nombre actividad obligatorio'	
		},
		'subtitulo': {
			'required': 'Descripcion Obligatorio'		
		},
		'imagen': {
			'required': 'Debe descargar un Imagen'		
		}
	};	
}

class Archivo{
	constructor(
		public titulo:string,
		public keym:string,
		public id_usuario:string,
		public id_caracteristica:string,
		public id_usuario_act:string,
		public tipo:string,

		) {  }
}