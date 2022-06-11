import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'app-operation-control',
  templateUrl: './operation-control.component.html',
  styles: [
  ]
})
export class OperationControlComponent implements OnInit {

  controlTransactionIsActive: boolean = true;
  loading = false;

  constructor(
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sharedService.getControlStatus().subscribe(status => {
      this.controlTransactionIsActive = status;
    });
  }

  async toggleControlTransaction(){

    const controlIsActive = this.controlTransactionIsActive;
    let msg = '';
    if(controlIsActive){
        msg = 'ALERTA. ESTE BOTON PERMITIRÁ QUE EL ALUMNO SE INSCRIBA CON UNA TRANSACCION EXISTENTE';
    }else{
        msg = 'ALERTA. ESTE BOTON ACTIVARÁ EL CONTROL DE NO DUPLICIDAD';
    }
    const decision = await Swal.fire({
        title: 'Ingrese contraseña',
        input: 'text',
        html:
        `<p>
        ${msg}
        </p>`,
        inputAttributes: {
          autocapitalize: 'off',
          autocomplete: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading()
      });

    if (decision.dismiss || decision.isDenied) {
        return;
    }

    if (!decision.isConfirmed || decision.value!='159753') {
        Swal.fire('Ups!', 'Código Incorrecto', 'error');
        return;
    }

    this.loading = true;
    this.sharedService.toggleControl().subscribe(
      status => {
        this.controlTransactionIsActive = status;
        Swal.fire(`Bien hecho!`, `Control ${status ? 'Activado' : 'Desactivado'}`, `success`);
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

}
