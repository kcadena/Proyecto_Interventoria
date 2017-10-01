import { Component, OnInit, Input } from "@angular/core";
import { NgModule } from "@angular/core";

import { Router } from "@angular/router";
import { ServiciosGlobales } from "../../services/servicios-globales";
import { ServiciosGlobalesActividades } from "../servicios-globales-actividades";
import { Servicios } from "../../services/servicios";

@Component({
  selector: "app-remarks",
  templateUrl: "./remarks.component.html",
  styleUrls: ["./remarks.component.css"]
})
export class RemarksComponent implements OnInit {


  cad: string = '';
  @Input() tipo_usuario :string ='';

  constructor(
    private serviciog: ServiciosGlobales,
    private serviGloAct: ServiciosGlobalesActividades,
    private router: Router,
    private servicios: Servicios
  ) {}

  ngOnInit() {}
  regMark() {
    var dat = {
      keym:this.serviciog.actividad.keym,
      id_caracteristica:this.serviciog.actividad.id_caracteristica,
      id_usuario:this.serviciog.actividad.id_usuario,
      usu_observacion:this.serviciog.usuario.id_usuario,
      observacion:this.cad
    };
    var formData = new FormData();
    formData.append("remark",JSON.stringify(dat));

    this.servicios.regRemarks(formData)
    .then(message =>{
      //alert(JSON.stringify(message));
      var mark = {usuario:this.serviciog.usuario.nombre +' '+this.serviciog.usuario.apellido , observacion:this.cad};
      this.serviGloAct.remarks.push(mark);
      //this.serviGloAct.remarks = message;
    })
  }
}
