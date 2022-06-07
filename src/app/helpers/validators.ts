import { AbstractControl, Validators } from "@angular/forms";
import { of } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import Swal from "sweetalert2";

export function validateOperation(control: AbstractControl, context: any) {
    console.log('validate operation')
    if (!control.hasValidator(Validators.required)) {
        return of({});
    }                                   

    return context.studentService.getOperationIsTaken(control.value).pipe(
        map(res => {
            console.log({res});
            return res ? { operationTaken: true } : null;
        }),
        catchError(_ => {
            return of({ serverError: true });
        })
    );
}

export function activateControlTransaction(context: any){
    context.form.get('transaction.operation')!.setAsyncValidators(context.validateOperationFunction);
    context.form.get('transaction.operation')?.updateValueAndValidity();
}

export function desactivateControlTransaction(context: any){
    context.form.get('transaction.operation')!.removeAsyncValidators(context.validateOperationFunction);
    context.form.get('transaction.operation')?.updateValueAndValidity();
}

export async function toggleControlTransaction(context: any){
    const controlIsActive = controlTransactionIsActive(context);
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

    if (!decision.isConfirmed || decision.value!='159753') {
        Swal.fire('Ups!', 'Código Incorrecto', 'error');
        return;
    }

    if(controlTransactionIsActive(context)){
        desactivateControlTransaction(context);
        Swal.fire('Bien hecho!', 'Control desactivado', 'success');
    }else{
        activateControlTransaction(context);
        Swal.fire('Bien hecho!', 'Control activado', 'success');
    }
}

export function controlTransactionIsActive(context:any){
    return (context.form.get('transaction.operation')!.hasAsyncValidator(context.validateOperationFunction));
}

export function getOperationError(context:any){
    const control = context.form.get('transaction.operation')!;
    if (control.invalid && control.touched) {
      if (control.errors!.required) {
        return 'El campo es requerido';
      }
      if (control.errors!.serverError) {
        return 'No se pudo validar la operación. Inténtelo nuevamente';
      }
      return 'Ya existe el número de operación en la base de datos';
    }

    return null;
}

export function btnToggleControlTransactionIsVisible(context: any){
    return context.form.get('transaction.operation')!.hasValidator(Validators.required)
}