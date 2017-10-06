import { Component, OnInit } from "@angular/core";
import { NgModule } from "@angular/core";
import { AgmCoreModule } from "@agm/core";

import { Router } from "@angular/router";
import { ServiciosGlobales } from "../services/servicios-globales";
import { Servicios } from "../services/servicios";
import { ServiciosGlobalesActividades } from "./servicios-globales-actividades";

@Component({
  selector: "actividad-panel",
  templateUrl: "./actividad-panel.component.html",
  styleUrls: ["./actividad-panel.component.css"]
})
export class ActividadPanel implements OnInit {
  public slideval: number = 0;
  nom_act_report: string[] = [];
  listDatChart: any[] = [];
  isTitleSelected: boolean = false;
  act_ant: string = "";
  miPorcentaje: number = 100;
  porcentajeAsignado: number = 0;
  flag: boolean = true;
  isEditar: boolean = false;
  isSubActivity: any = [];
  subActivity: any = 0;
  usuarios: any = [];
  flg: boolean = true;
  porcentaje_ejecutado: number;
  activityList: any = [];
  listTypes: any[] = [];
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [
    "2006",
    "2007",
    "2008",
    "2009",
    "2010",
    "2011",
    "2012"
  ];
  public barChartType: string = "bar";
  public barChartLegend: boolean = true;
  public barChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: "Categoria 1" },
    { data: [28, 48, 40, 19, 86, 27, 90], label: "Categoria 2" },
    { data: [28, 48, 40, 19, 86, 27, 92], label: "Categoria 3" }
  ];
  public barColor: any[] = [
    { backgroundColor: ["rgba(15, 255, 0, 0.8)", "rgba(255, 9, 0, 0.81)"] }
  ];
  public doughnutChartLabels: string[] = ["EJECUTADO", "NO EJECUTADO"];
  public doughnutChartData: number[] = [10, 20];
  public doughnutChartType: string = "doughnut";

  constructor(
    private serviciog: ServiciosGlobales,
    private serviGloAct: ServiciosGlobalesActividades,
    private router: Router,
    private servicios: Servicios
  ) { }

  ngOnInit(): void {

    //alert(JSON.stringify(this.serviciog.proyecto));

    this.serviciog.actividad = null;
    this.serviciog.isSelAct = false;
    this.serviciog.isSubActivity = null;
    this.serviciog.isSelAct = false;
    this.serviGloAct.actOpt = 0;
    this.serviciog.tree_name = [];

    if (this.serviciog.usuario.tipo_usuario === "sup") this.flg = false;


    //alert(JSON.stringify(this.serviciog.tree_name));
    //this.serviciog.tree_name.push(this.serviciog.proyecto.nom_pro);

    this.serviciog.actividades = [];
    this.activityList = [];
    if (this.serviciog.proyecto) {
      this.slideval = this.serviciog.proyecto.porcentaje_cumplido;
      this.serviciog.tree_name.push(this.serviciog.proyecto.nom_pro);
      //alert(JSON.stringify(this.serviciog.tree_name));
      this.serviciog.titulo = this.serviciog.proyecto.nom_pro;
      var keym = this.serviciog.proyecto.keym;
      var id_usuario = this.serviciog.proyecto.id_usuario;
      var id_caracteristica = this.serviciog.proyecto.id_caracteristica;

      this.servicios
        .getActividad(keym, id_usuario, id_caracteristica)
        .then(actividades => {
          if (actividades) {
            this.serviciog.actividades = actividades;
            //alert(JSON.stringify(actividades));
            this.activityList = actividades;
            this.calculateValue(this.serviciog.actividades);
            var num = this.serviciog.tipos_act.indexOf(actividades[0].tipo);
            this.serviGloAct.tipo = this.serviciog.tipos_act[num + 1];
            this.serviGloAct.tipo2 = this.serviciog.tipos_act[num];
            //alert(JSON.stringify(this.serviciog.actividades));
            //alert('2 '+this.serviGloAct.tipo);
          }
        });
    } else {
      let link = ["administrador"];
      this.router.navigate(link);
      this.serviciog.tree_name.pop();
      //alert(JSON.stringify(this.serviciog.tree_name));
    }
  }

  actualizarActividad(actividad) {
    var isUpdatePercentage = false;
    this.isEditar = !this.isEditar;
    ////se comprueba si ubieron cambios en el porcentaje ejecutado
    if (this.porcentaje_ejecutado != actividad.porcentaje_cumplido) {
      this.porcentaje_ejecutado = actividad.porcentaje_cumplido - this.porcentaje_ejecutado;
      //this.porcentaje_ejecutado = this.porcentaje_ejecutado * (actividad.porcentaje/100);

      isUpdatePercentage = true;
      //alert(this.porcentaje_ejecutado);
    }

    var formData = new FormData();
    formData.append("actividad", JSON.stringify(actividad));
    formData.append(
      "porcentaje_cumplido",
      JSON.stringify(this.porcentaje_ejecutado)
    );
    formData.append("isUpdatePercentage", JSON.stringify(isUpdatePercentage));

    this.servicios.updateCaracteristica(formData).then(message => {
      alert(JSON.stringify(message));
    });
  }

  editarClick(actividad) {
    this.isEditar = !this.isEditar;
    this.porcentaje_ejecutado = actividad.porcentaje_cumplido;
  }

  onSelectActivity(activity) {
    activity.porcentaje_cumplido = activity.porcentaje_cumplido * 1;
    this.slideval = activity.porcentaje_cumplido;

    this.isTitleSelected = false;
    this.miPorcentaje = 100;
    this.porcentajeAsignado = 0;
    this.serviciog.actividad = activity;
    this.serviciog.isSelAct = true;
    this.serviGloAct.actOpt = 1;
    this.serviGloAct.subActividades = [];

    var keym = activity.keym;
    var id_usuario = activity.id_usuario;
    var id_caracteristica = activity.id_caracteristica;

    this.serviGloAct.actOpt = 1;
    if (this.isTitleSelected && this.serviciog.actividad == null)
      var dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };
    else if (this.serviciog.actividad)
      var dat = {
        keym: this.serviciog.actividad.keym,
        id_caracteristica: this.serviciog.actividad.id_caracteristica,
        id_usuario: this.serviciog.actividad.id_usuario,
        tipo: this.serviciog.actividad.tipo
      };
    else
      var dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };

    //alert(dat.tipo);
    this.serviciog.colors = [];
    this.serviciog.color = [];
    this.serviciog.labels = [];
    this.serviciog.data = [];
    var formData = new FormData();
    formData.append("caracteristica", JSON.stringify(dat));
    this.servicios.getDataChart(formData).then(message => {
      //alert(JSON.stringify(message));

      this.serviciog.listDatChart = [];
      this.serviciog.listDatChart = message;
      var ax: any[] = [];
      this.serviciog.listDatChart.forEach(element => {
        ax.push(element.gettotalmarkerscategory);
      });
      this.serviciog.listDatChart = ax;
      var val = 0;
      this.serviciog.listDatChart.forEach(element => {
        var x = element.split(',');
        var num = parseInt(x[2]);
        if (num)
          val = val + num;
      });
      this.serviciog.listDatChart.forEach(element => {
        element = element.replace('(', '');
        element = element.replace(')', '');
        var x = element.split(',');
        this.serviciog.color.push(x[0]);

        var num = parseInt(x[2]);
        if (num) {
          var z = num * 100 / val;
          this.serviciog.data.push(z);
          this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : ' + z + ' %');
        }
        else {
          this.serviciog.data.push(0);
          this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : 0 %');
        }
      });
      this.serviciog.colors = [
        { backgroundColor: this.serviciog.color }
      ];
    });

    this.servicios
      .getActividad(keym, id_usuario, id_caracteristica)
      .then(actividades => {
        if (actividades) {
          this.serviGloAct.subActividades = actividades;
          var num = this.serviciog.tipos_act.indexOf(
            this.serviGloAct.subActividades[0].tipo
          );
          this.serviGloAct.tipo = this.serviciog.tipos_act[num];

          this.calculateValue(actividades);
        }
      });
  }

  valPor(flag, i) {
    if (flag) {
      if (this.serviciog.actividades[i].porcentaje < 0) {
        this.serviciog.actividades[i].porcentaje = 0;
        this.calculateValue(this.serviciog.actividades);
      } else if (this.serviciog.actividades[i].porcentaje > 100) {
        this.serviciog.actividades[i].porcentaje = 100;
        this.calculateValue(this.serviciog.actividades);
      } else {
        this.calculateValue(this.serviciog.actividades);
      }
    } else {
      this.calculateValue(this.serviGloAct.subActividades);
    }
  }

  tituloClick() {
    
    //alert(JSON.stringify(this.serviciog.proyecto));
    this.isTitleSelected = true;
    this.serviciog.actividad = null;

    var num = this.serviciog.tipos_act.indexOf(
      this.serviciog.actividades[0].tipo
    );
    this.serviGloAct.tipo2 = this.serviciog.tipos_act[num];
    //alert('Global act  '+JSON.stringify(this.serviGloAct));

    if (!this.serviciog.isSubActivity) {
      this.serviciog.isSelAct = false;
      this.serviGloAct.actOpt = 0;
    } else {
      this.serviGloAct.actOpt = 1;
      this.serviciog.actividad = this.serviciog.isSubActivity;
      //alert('Global act  ' + JSON.stringify(this.serviciog.isSubActivity));
      this.serviciog.actividad.porcentaje_cumplido = this.serviciog.actividad.porcentaje_cumplido * 1;
      //alert(this.serviciog.actividad);
      this.slideval = this.serviciog.isSubActivity.porcentaje_cumplido * 1;
    }

    if (this.isTitleSelected && this.serviciog.actividad == null)
      var dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };
    else if (this.serviciog.actividad)
      var dat = {
        keym: this.serviciog.actividad.keym,
        id_caracteristica: this.serviciog.actividad.id_caracteristica,
        id_usuario: this.serviciog.actividad.id_usuario,
        tipo: this.serviciog.actividad.tipo
      };
    else
      var dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario,
        tipo: this.serviciog.proyecto.tipo
      };
    this.serviciog.colors = [];
    this.serviciog.color = [];
    this.serviciog.labels = [];
    this.serviciog.data = [];
    var formData = new FormData();
    formData.append("caracteristica", JSON.stringify(dat));
    this.servicios.getDataChart(formData).then(message => {
      //alert(JSON.stringify(message));
      this.serviciog.listDatChart = [];
      this.serviciog.listDatChart = message;
      var ax: any[] = [];
      this.serviciog.listDatChart.forEach(element => {
        ax.push(element.gettotalmarkerscategory);
      });
      this.serviciog.listDatChart = ax;
      var val = 0;
      this.serviciog.listDatChart.forEach(element => {
        var x = element.split(',');
        var num = parseInt(x[2]);
        if (num) val = val + num;
      });
      this.serviciog.listDatChart.forEach(element => {
        element = element.replace('(', '');
       element = element.replace(')', '');
        var x = element.split(',');
        this.serviciog.color.push(x[0]);

        var num = parseInt(x[2]);
        if (num) {
          var z = num * 100 / val;
          this.serviciog.data.push(z);
          this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : ' + z + ' %');
        }
        else {
          this.serviciog.data.push(0);
          this.serviciog.labels.push(x[1].replace(/"/g, '') + ' : 0 %');
        }
      });
      this.serviciog.colors = [{ backgroundColor: this.serviciog.color }];
    });

  }

  //actualiza los porcentajes de las  actividades hijas
  sendPercentage() {
    var formData = new FormData();
    if (!this.serviciog.isSelAct) {
      formData.append(
        "actividades",
        JSON.stringify(this.serviciog.actividades)
      );
    } else {
      formData.append(
        "actividades",
        JSON.stringify(this.serviGloAct.subActividades)
      );
    }

    this.servicios.updatePercentage(formData).then(message => {
      alert(JSON.stringify(message));
    });
  }

  inicio() {

    for (var i = 0; i < this.serviciog.tree_name.length; i++) {
      this.serviciog.tree_name.pop();
    }
    this.serviGloAct.tipo2 = this.serviciog.tipos_act[
      this.serviciog.tipos_act.indexOf(this.serviciog.proyecto.tipo) + 1
    ];

    this.serviciog.titulo = this.serviciog.proyecto.nom_pro;

    var keym = this.serviciog.proyecto.keym;
    var id_usuario = this.serviciog.proyecto.id_usuario;
    var id_caracteristica = this.serviciog.proyecto.id_caracteristica;
    this.serviciog.isSubActivity = null;
    this.serviciog.isSelAct = false;
    this.serviGloAct.actOpt = 0;
    this.servicios
      .getActividad(keym, id_usuario, id_caracteristica)
      .then(actividad => {
        this.serviciog.actividades = actividad;
        this.activityList = actividad;
        actividad.porcentaje_cumplido = actividad.porcentaje_cumplido * 1;
        this.slideval = actividad.porcentaje_cumplido;
      });
  }

  entrarACtividad(actividad) {
    actividad.porcentaje_cumplido = actividad.porcentaje_cumplido * 1;
    this.slideval = actividad.porcentaje_cumplido;
    this.isTitleSelected = true;
    this.serviciog.tree_name.push(actividad.nom_act);
    this.serviGloAct.tipo2 = this.serviciog.tipos_act[
      this.serviciog.tipos_act.indexOf(actividad.tipo) + 1
    ];
    //alert(JSON.stringify(this.serviciog.tree_name));

    this.serviGloAct.lastActividad.push(this.serviciog.isSubActivity);

    this.subActivity = [];
    this.serviciog.actividades = [];
    this.activityList = [];
    this.serviciog.actividad = actividad;
    this.serviciog.isSubActivity = actividad;
    var keym = actividad.keym;
    var id_usuario = actividad.id_usuario;
    var id_caracteristica = actividad.id_caracteristica;

    this.serviciog.titulo = actividad.nom_act;
    this.serviGloAct.actOpt = 1;




    this.servicios
      .getActividad(keym, id_usuario, id_caracteristica)
      .then(actividad => {
        if (actividad) {
          this.serviciog.actividades = actividad;
          this.activityList = actividad;
          var num = this.serviciog.tipos_act.indexOf(
            this.serviciog.actividades[0].tipo
          );
          this.serviGloAct.tipo = this.serviciog.tipos_act[num + 1];
          //alert('1 '+this.serviGloAct.tipo);
        }
      });
  }

  regresar() {
    this.serviciog.tree_name.pop();

    //alert(JSON.stringify(this.serviciog.tree_name));

    var lastActividad = this.serviGloAct.lastActividad.pop();

    if (lastActividad != this.serviciog.isSubActivity && lastActividad) {
      this.serviGloAct.tipo2 = this.serviciog.tipos_act[
        this.serviciog.tipos_act.indexOf(lastActividad.tipo) + 1
      ];
      this.subActivity = [];
      this.serviciog.actividades = [];
      this.activityList = [];
      this.serviciog.actividad = lastActividad;
      this.serviciog.isSubActivity = lastActividad;
      var keym = lastActividad.keym;
      var id_usuario = lastActividad.id_usuario;
      var id_caracteristica = lastActividad.id_caracteristica;

      this.serviciog.titulo = lastActividad.nom_act;
      this.serviGloAct.actOpt = 1;

      this.servicios
        .getActividad(keym, id_usuario, id_caracteristica)
        .then(actividad => {
          if (actividad) {
            this.serviciog.actividades = actividad;
            this.activityList = actividad;
            var num = this.serviciog.tipos_act.indexOf(actividad[0].tipo);
            this.serviGloAct.tipo = this.serviciog.tipos_act[num];
          }
        });
    } else {
      this.serviGloAct.tipo2 = this.serviciog.tipos_act[0];
      this.inicio();
    }
  }

  getUsers() {
    if (this.serviciog.usuario.tipo_usuario !== "sup")
      this.servicios.getUserList(null).then(usuarios => {
        if (usuarios) {
          this.usuarios = usuarios;
        }
      });
  }

  asignarUsuario(usuario) {
    this.serviciog.actividad.usr_nom = usuario.nombre;
    this.serviciog.actividad.usr_ape = usuario.apellido;
    this.serviciog.actividad.e_mail = usuario.e_mail;
    //alert(JSON.stringify(usuario))
    var formData = new FormData();
    formData.append("keym", "0");
    formData.append("usuario", JSON.stringify(usuario));
    formData.append("caracteristica", JSON.stringify(this.serviciog.actividad));
    //alert(formData.toString());
    this.servicios.assignActivityToUser(formData).then(message => {
      alert(JSON.stringify(message));
    });
  }

  //Detalles    =   Detalles del proyecto padre
  c0() {
    this.serviGloAct.actOpt = 0;
  }

  //Detalles    =   Muestra informacion detallada del proyecto interno o actividad seleccionada
  c1() {
    this.serviGloAct.actOpt = 1;
   
  }
  //LISTA       =   Lista de actividades => cambia nombre segun proyecto municipios resguardos beneficiario etc. 
  c2() {
    this.serviGloAct.actOpt = 2;
  }

  //Reporte
  c3() {
    this.serviGloAct.actOpt = 3;
    this.listTypes = [];
    this.serviGloAct.observaciones = [];
    //alert(JSON.stringify(this.serviciog.actividad));
    if (this.isTitleSelected && this.serviciog.actividad == null)
      var dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario
      };
    else if (this.serviciog.actividad)
      var dat = {
        keym: this.serviciog.actividad.keym,
        id_caracteristica: this.serviciog.actividad.id_caracteristica,
        id_usuario: this.serviciog.actividad.id_usuario
      };
    else
      var dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario
      };

    var formData = new FormData();
    formData.append("caracteristica", JSON.stringify(dat));
    this.servicios.getObservaciones(formData).then(message => {
      //alert(JSON.stringify(message));
      this.serviGloAct.observaciones = message;
    });

    var frmDat = new FormData();
    frmDat.append("caracteristica", JSON.stringify(dat));
    this.servicios.getTypes(frmDat).then(message => {
      //alert(JSON.stringify(message));
      message.forEach(element => {
        var x = element.gettypes;
        this.listTypes.push(x);
        console.log(x);
      });
    });



    if (this.serviciog.isSelAct) {
      var numSi = this.serviciog.actividad.porcentaje_cumplido;
      var numNo = 100 - numSi;
      this.doughnutChartData = [numSi, numNo];
    } else {
      var numSi = this.serviciog.proyecto.porcentaje_cumplido;
      var numNo = 100 - numSi;
      this.doughnutChartData = [numSi, numNo];
    }
  }

  //Multimedia
  c4() {
    this.serviGloAct.actOpt = 4;
  }

  //Estadisticas  - Diagramas Charts
  c5() {
    this.serviGloAct.actOpt = 5;
    //alert(JSON.stringify(this.serviciog.actividad));
    if (this.serviciog.isSelAct) {
      var numSi = this.serviciog.actividad.porcentaje_cumplido;
      var numNo = 100 - numSi;
      this.doughnutChartData = [numSi, numNo];
    } else {
      var numSi = this.serviciog.proyecto.porcentaje_cumplido;
      var numNo = 100 - numSi;
      this.doughnutChartData = [numSi, numNo];
    }
  }

  //mapa
  c6() {
    this.serviGloAct.actOpt = 6;
  }

  //CATEGORIAS  -  Se Asignan las categorias de los mapas 
  c7() {
    this.serviGloAct.actOpt = 7;
  }

  //PORCENTAJE  -  Cambian porcentajes a Actividades
  c8() {
    this.serviGloAct.actOpt = 8;
  }

  //Recomendaciones
  c9() {
    this.serviGloAct.remarks = [];
    this.serviGloAct.actOpt = 9;
    console.log(this.serviciog.proyecto);
    console.log(this.serviciog.actividad);
    if (this.isTitleSelected && this.serviciog.actividad == null)
      var dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario
      };
    else if (this.serviciog.actividad)
      var dat = {
        keym: this.serviciog.actividad.keym,
        id_caracteristica: this.serviciog.actividad.id_caracteristica,
        id_usuario: this.serviciog.actividad.id_usuario
      };
    else
      var dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario
      };

    var formData = new FormData();
    formData.append("caracteristica", JSON.stringify(dat));

    this.servicios.getRemarks(formData).then(message => {
      //alert(JSON.stringify(message));
      this.serviGloAct.remarks = message;
    });
  }

  //Observaciones
  c10() {
    this.serviGloAct.observaciones = [];
    this.serviGloAct.actOpt = 10;
    //alert(JSON.stringify(this.serviciog.actividad));
    if (this.isTitleSelected && this.serviciog.actividad == null)
      var dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario
      };
    else if (this.serviciog.actividad)
      var dat = {
        keym: this.serviciog.actividad.keym,
        id_caracteristica: this.serviciog.actividad.id_caracteristica,
        id_usuario: this.serviciog.actividad.id_usuario
      };
    else
      var dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario
      };
    var formData = new FormData();
    formData.append("caracteristica", JSON.stringify(dat));

    this.servicios.getObservaciones(formData).then(message => {
      //alert(JSON.stringify(message));
      this.serviGloAct.observaciones = message;
    });
  }

  c11(){
    this.serviGloAct.actOpt = 11;
    //alert(JSON.stringify(this.serviciog.actividad));
    if (this.isTitleSelected && this.serviciog.actividad == null)
      var dat = {
        keym: this.serviciog.proyecto.keym,
        id_caracteristica: this.serviciog.proyecto.id_caracteristica,
        id_usuario: this.serviciog.proyecto.id_usuario
      };
    else if (this.serviciog.actividad)
      var dat = {
        keym: this.serviciog.actividad.keym,
        id_caracteristica: this.serviciog.actividad.id_caracteristica,
        id_usuario: this.serviciog.actividad.id_usuario
      };
    else
    var dat = {
      keym: this.serviciog.proyecto.keym,
      id_caracteristica: this.serviciog.proyecto.id_caracteristica,
      id_usuario: this.serviciog.proyecto.id_usuario
    };
  }

  calculateValue(actividades) {
    var percent = 0;
    for (let i = 0; i < actividades.length; i++) {
      percent = percent + Number(actividades[i].porcentaje);
    }
    this.porcentajeAsignado = percent;
    this.miPorcentaje = 100 - this.porcentajeAsignado;
  }

  //Realiza busqueda y filtro de las actividades que estan al lado izquierdo
  btnSearchAct(value: string) {
    //alert(JSON.stringify(this.serviciog.actividades[0].tipo));

    if (this.serviciog.actividades[0].tipo !== "Beneficiario")
      this.activityList = this.serviciog.actividades.filter(item => {
        return (
          (item.tipo + item.nom_act)
            .toLowerCase()
            .replace(/ /g, "")
            .indexOf(value.replace(/ /g, "").toLowerCase()) !== -1
        );
      });
    else
      this.activityList = this.serviciog.actividades.filter(item => {
        return (
          (item.cedula + item.nombre)
            .toLowerCase()
            .replace(/ /g, "")
            .indexOf(value.replace(/ /g, "").toLowerCase()) !== -1
        );
      }
      );
    //alert(JSON.stringify(this.activityList));

  }

  //actualiza el valor del porcentaje cumplido cunado se cambia el valor del slider
  slideValue(activity) {
    var perComp = activity.porcentaje_cumplido - this.slideval;

    if (perComp != 0) {
      //alert(activity.porcentaje_cumplido+'   +   '+this.slideval +'  = '+perComp);
      var formData = new FormData();
      formData.append("actividad", JSON.stringify(activity));
      formData.append("porcentaje_cumplido", JSON.stringify(perComp));
      this.slideval = activity.porcentaje_cumplido;
      this.servicios.updateCompletePercentage(formData).then(message => {
        //alert(JSON.stringify(message));
      });
    }
  }

  //actualiza el valor del porcentaje cumplido cunado se cambia el valor en la caja de texto
  changeEtapa(etapa, tipo) {
    if (tipo = 'P') {
      if (etapa != this.serviciog.proyecto.estado) {
        var formData = new FormData();
        formData.append("actividad", JSON.stringify(this.serviciog.proyecto));
        formData.append("etapa", JSON.stringify(etapa));
        this.servicios.updateEtapa(formData).then(message => {
          this.serviciog.proyecto.estado = etapa;
          if (message == 'true')
            alert("Actualizado");
        });
      }
    }
    else if (tipo = 'A') {
      if (etapa != this.serviciog.actividad.estado) {
        var formData = new FormData();
        formData.append("actividad", JSON.stringify(this.serviciog.actividad));
        formData.append("etapa", JSON.stringify(etapa));
        this.servicios.updateEtapa(formData).then(message => {
          this.serviciog.actividad.estado = etapa;
          if (message)
            alert("Actualizado");
        });
      }
    }


  }


  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    //alert("HOver")
    console.log(e);
  }
}
