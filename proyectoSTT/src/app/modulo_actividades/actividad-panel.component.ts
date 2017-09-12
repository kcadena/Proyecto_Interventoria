
import { Component, OnInit}  from '@angular/core';
import { NgModule } 		 from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { Router }            from '@angular/router';
import { ServiciosGlobales } from '../services/servicios-globales';
import { Servicios }         from '../services/servicios';
import { ServiciosGlobalesActividades} from './servicios-globales-actividades'

@Component({
	selector: 'actividad-panel',
	templateUrl: './actividad-panel.component.html',
	styleUrls: [ './actividad-panel.component.css' ]
})

export class ActividadPanel implements OnInit{
	
	isTitleSelected : boolean = false;
	act_ant : string ='';

	miPorcentaje:number = 100;
	porcentajeAsignado:number = 0;
	flag:boolean=true;
	isEditar:boolean=false;
	isSubActivity:any = [];
	subActivity:any = 0;
	usuarios:any = [];
	flg : boolean = true;
	porcentaje_ejecutado:number;


	constructor(
		private serviciog:ServiciosGlobales,
		private serviGloAct:ServiciosGlobalesActividades,
		private router:Router,
		private servicios: Servicios
		){ };

	ngOnInit():void {
		if(this.serviciog.usuario.tipo_usuario === 'sup')
			this.flg = false;

		this.serviciog.tree_name.push(this.serviciog.proyecto.nombre);
		//alert(JSON.stringify(this.serviciog.tree_name));

		this.serviciog.actividades = [];
		if(this.serviciog.proyecto){
			this.serviciog.titulo = this.serviciog.proyecto.nom_pro;
			var keym = this.serviciog.proyecto.keym;
			var id_usuario = this.serviciog.proyecto.id_usuario;
			var id_caracteristica = this.serviciog.proyecto.id_caracteristica;

			this.servicios.getActividad(keym,id_usuario,id_caracteristica)
			.then(actividades =>{
				if(actividades){
					this.serviciog.actividades = actividades;
					this.calculateValue(this.serviciog.actividades);
					var num =this.serviciog.tipos_act.indexOf(actividades[0].tipo);
					this.serviGloAct.tipo = this.serviciog.tipos_act[num + 1];
					//alert(JSON.stringify(this.serviciog.actividades));
					//alert('2 '+this.serviGloAct.tipo);

				}
			});
		}else{
			let link = ['administrador'];
			this.router.navigate(link);
		}

	}

	actualizarActividad(actividad){
		var isUpdatePercentage = false;

		////se comprueba si ubieron cambios en el porcentaje ejecutado
		if(this.porcentaje_ejecutado != actividad.porcentaje_cumplido){
			this.porcentaje_ejecutado = actividad.porcentaje_cumplido - this.porcentaje_ejecutado;
			//this.porcentaje_ejecutado = this.porcentaje_ejecutado * (actividad.porcentaje/100);
			this.isEditar = !this.isEditar;
			isUpdatePercentage = true;
			//alert(this.porcentaje_ejecutado);
		}

		var formData = new FormData();
		formData.append("actividad",JSON.stringify(actividad));
		formData.append("porcentaje_cumplido",JSON.stringify(this.porcentaje_ejecutado));
		formData.append("isUpdatePercentage",JSON.stringify(isUpdatePercentage));

		this.porcentaje_ejecutado = 0;
		this.servicios.updateCaracteristica(formData)
		.then(message=>{
			alert(JSON.stringify(message));
		});
	}

	editarClick(actividad){
		this.isEditar = !this.isEditar;
		this.porcentaje_ejecutado = actividad.porcentaje_cumplido;
	}

	onSelectActivity(activity){
		this.isTitleSelected = false;
		this.miPorcentaje = 100;
		this.porcentajeAsignado =0;
		this.serviciog.actividad = activity;
		this.serviciog.isSelAct = true;
		this.serviGloAct.actOpt = 1;
		this.serviGloAct.subActividades = [];

		var keym = activity.keym;
		var id_usuario = activity.id_usuario;
		var id_caracteristica = activity.id_caracteristica;

		this.servicios.getActividad(keym,id_usuario,id_caracteristica)
		.then(actividades =>{
			if(actividades){
				this.serviGloAct.subActividades = actividades;
				var num =this.serviciog.tipos_act.indexOf(this.serviGloAct.subActividades[0].tipo);
				this.serviGloAct.tipo = this.serviciog.tipos_act[num];

				this.calculateValue(actividades);
			}
		});

	}

	valPor(flag,i){
		if(flag){
			if(this.serviciog.actividades[i].porcentaje < 0){
				this.serviciog.actividades[i].porcentaje = 0;
				this.calculateValue(this.serviciog.actividades);
			}else if(this.serviciog.actividades[i].porcentaje > 100){
				this.serviciog.actividades[i].porcentaje = 100;
				this.calculateValue(this.serviciog.actividades);
			}else{
				this.calculateValue(this.serviciog.actividades);
			}
		}else{
			this.calculateValue(this.serviGloAct.subActividades);
		}
	}

	tituloClick(){

		this.isTitleSelected = true;

		var num =this.serviciog.tipos_act.indexOf(this.serviciog.actividades[0].tipo);
		this.serviGloAct.tipo2 = this.serviciog.tipos_act[num];
		//alert('ok  '+num+'   '+this.serviGloAct.tipo);

		if(!this.serviciog.isSubActivity){
			this.serviciog.isSelAct = false;
			this.serviGloAct.actOpt = 0;
		}else{
			this.serviciog.actividad = this.serviciog.isSubActivity;
		}
	}

	sendPercentage()
	{
		var formData = new FormData();
		if(!this.serviciog.isSelAct){
			formData.append("actividades",JSON.stringify(this.serviciog.actividades))
		}
		else{
			formData.append("actividades",JSON.stringify(this.serviGloAct.subActividades))
		}

		this.servicios.updatePercentage(formData)
		.then(message => {
			alert(JSON.stringify(message));
		});

	}

	inicio(){
		this.serviciog.titulo = this.serviciog.proyecto.nombre;

		var keym = this.serviciog.proyecto.keym;
		var id_usuario = this.serviciog.proyecto.id_usuario;
		var id_caracteristica = this.serviciog.proyecto.id_caracteristica;
		this.serviciog.isSubActivity = null;
		this.serviciog.isSelAct = false;
		this.serviGloAct.actOpt = 0;
		this.servicios.getActividad(keym,id_usuario,id_caracteristica)
		.then(actividad => this.serviciog.actividades = actividad );
	}

	entrarACtividad(actividad){

		this.serviciog.tree_name.push(actividad.nom_act);
		this.serviGloAct.tipo2 = this.serviciog.tipos_act[this.serviciog.tipos_act.indexOf(actividad.tipo)+1];
		//alert(JSON.stringify(this.serviciog.tree_name));

		this.serviGloAct.lastActividad.push(this.serviciog.isSubActivity);


		this.subActivity = [];
		this.serviciog.actividades = [];
		this.serviciog.actividad = actividad;
		this.serviciog.isSubActivity = actividad;
		var keym = actividad.keym;
		var id_usuario = actividad.id_usuario;
		var id_caracteristica = actividad.id_caracteristica;

		this.serviciog.titulo = actividad.nom_act;
		this.serviGloAct.actOpt= 1;


		this.servicios.getActividad(keym,id_usuario,id_caracteristica)
		.then(actividad => {
			if(actividad){
				this.serviciog.actividades = actividad;
				var num =this.serviciog.tipos_act.indexOf(this.serviciog.actividades[0].tipo);
				this.serviGloAct.tipo = this.serviciog.tipos_act[num + 1];
				//alert('1 '+this.serviGloAct.tipo);
			}
		});
	}

	regresar(){

		this.serviciog.tree_name.pop();

		//alert(JSON.stringify(this.serviciog.tree_name));

		var lastActividad = this.serviGloAct.lastActividad.pop();
this.serviGloAct.tipo2 = this.serviciog.tipos_act[this.serviciog.tipos_act.indexOf(lastActividad.tipo)+1];
		if(lastActividad!= this.serviciog.isSubActivity && lastActividad){
			this.subActivity = [];
			this.serviciog.actividades = [];
			this.serviciog.actividad = lastActividad;
			this.serviciog.isSubActivity = lastActividad;
			var keym = lastActividad.keym;
			var id_usuario = lastActividad.id_usuario;
			var id_caracteristica = lastActividad.id_caracteristica;

			this.serviciog.titulo = lastActividad.nom_act;
			this.serviGloAct.actOpt= 1;

			this.servicios.getActividad(keym,id_usuario,id_caracteristica)
			.then(actividad => {
				if(actividad){
					this.serviciog.actividades = actividad;
					var num =this.serviciog.tipos_act.indexOf(actividad[0].tipo);
					this.serviGloAct.tipo = this.serviciog.tipos_act[num];

				}
			});
		}else{
			this.inicio();
		}
	}

	getUsers(){
		if(this.serviciog.usuario.tipo_usuario!== 'sup')
			this.servicios.getUserList(null)
		.then(usuarios => {
			if(usuarios){
				this.usuarios = usuarios;
			}
		})
	}

	asignarUsuario(usuario){
		this.serviciog.actividad.usr_nom = usuario.nombre;
		this.serviciog.actividad.usr_ape = usuario.apellido;
		this.serviciog.actividad.e_mail = usuario.e_mail;
		//alert(JSON.stringify(usuario))
		var formData = new FormData();
		formData.append("keym","0");
		formData.append("usuario",JSON.stringify(usuario));
		formData.append("caracteristica",JSON.stringify(this.serviciog.actividad));
		//alert(formData.toString());
		this.servicios.assignActivityToUser(formData)
		.then(message =>{
			alert(JSON.stringify(message));

		})
	}

	public barChartOptions:any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
	public barChartType:string = 'bar';
	public barChartLegend:boolean = true;

	public barChartData:any[] = [
	{data: [65, 59, 80, 81, 56, 55, 40], label: 'Categoria 1'},
	{data: [28, 48, 40, 19, 86, 27, 90], label: 'Categoria 2'},
	{data: [28, 48, 40, 19, 86, 27, 92], label: 'Categoria 3'}
	];

	public barColor:any[] = [
	{backgroundColor: 'rgba(9,128,1,.8)'},
	{backgroundColor: 'rgba(255,255,1,.8)'},
	{backgroundColor: 'rgba(254,0,0,.8)'},
	{backgroundColor: '#4d86dc'},
	{backgroundColor: '#f3af37'}
	];

	public doughnutChartLabels:string[] = ['CUMPLIDO', 'NO CUMPLIDO'];
	public doughnutChartData:number[] = [10,20];
	public doughnutChartType:string = 'doughnut';

	// events
	public chartClicked(e:any):void {
		console.log(e);
	}

	public chartHovered(e:any):void {
		//alert("HOver")
		console.log(e);
	}


	c0(){
		this.serviGloAct.actOpt = 0;

	}

	c1(){
		this.serviGloAct.actOpt = 1;
	}

	c2(){
		this.serviGloAct.actOpt = 2;
	}

	c3(){
		this.serviGloAct.actOpt = 3;
		
		if(this.serviciog.isSelAct){
			var numSi = this.serviciog.actividad.porcentaje_cumplido;
			var numNo = 100 - numSi
			this.doughnutChartData = [
			numSi,
			numNo
			]

		}
		else{
			var numSi = this.serviciog.proyecto.porcentaje_cumplido;
			var numNo = 100 - numSi
			this.doughnutChartData = [
			numSi,
			numNo
			]
		}
	}

	c4(){
		this.serviGloAct.actOpt = 4;
	}

	c5(){
		this.serviGloAct.actOpt = 5;

		if(this.serviciog.isSelAct){
			var numSi = this.serviciog.actividad.porcentaje_cumplido;
			var numNo = 100 - numSi
			this.doughnutChartData = [
			numSi,
			numNo
			]

		}
		else{
			var numSi = this.serviciog.proyecto.porcentaje_cumplido;
			var numNo = 100 - numSi
			this.doughnutChartData = [
			numSi,
			numNo
			]
		}
	}
	c6(){
		this.serviGloAct.actOpt = 6;
	}
	c7(){
		this.serviGloAct.actOpt = 7;
	}
	c8(){
		this.serviGloAct.actOpt = 8;

	}
	c9(){
		this.serviGloAct.actOpt = 9;
		var dat = {
			keym:this.serviciog.actividad.keym,
			id_caracteristica:this.serviciog.actividad.id_caracteristica,
			id_usuario:this.serviciog.actividad.id_usuario
		};

		var formData = new FormData();
		formData.append("caracteristica",JSON.stringify(dat));

		this.servicios.getRemarks(formData)
		.then(message =>{
			//alert(JSON.stringify(message));
			this.serviGloAct.remarks = message;
		})
	}


	calculateValue(actividades){
		var percent = 0;
		for(let i = 0; i <actividades.length; i++){
			percent = percent + Number(actividades[i].porcentaje);
		}
		this.porcentajeAsignado = percent;
		this.miPorcentaje = 100 - this.porcentajeAsignado;
	}
}


