import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

export function deleteTransaction(transactionId: number, context: any, callback: any) {
    context.tillService.checkDeleteTransaction(transactionId)
        .pipe(
            switchMap((r) => {
                console.log(r)
                if (r === true) {
                    const swalPromise = Swal.fire({
                        title: 'Atención!',
                        text: "El pago que se desea eliminar pertenece a una transacción en donde se incluyó el pago de matrícula y mensualidad. Si sigue con el proceso se eliminará el comprobante que incluye ambos pagos. Desea continuar?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si, eliminar matrícula y pago de mensualidad',
                        cancelButtonText: 'No, cancelar'
                    });

                    return from(swalPromise);
                }
                return of(null);
            }),
            switchMap(
                (result: any) => {
                    console.log({ result })
                    if (result && !(result.isConfirmed)) {
                        return of(null);
                    }
                    return context.tillService.deleteTransaction(transactionId);
                }
            )
        ).subscribe({
            next: (resp: any) => {
                if (!resp) {
                    return;
                }
                Swal.fire('Bien Hecho', resp.message, resp.ok ? 'success' : 'error');
                callback();
            },
            error: (error: any) => alert('Ocurrió un error, contácte con el administrador')
        });
}