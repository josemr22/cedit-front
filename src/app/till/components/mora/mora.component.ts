import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TillService } from '../../services/till.service';
import { Router, ActivatedRoute } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Installment } from '../../interfaces/installment.interface';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mora',
  templateUrl: './mora.component.html',
  styles: [
  ]
})
export class MoraComponent implements OnInit {

  installment!: Installment;

  constructor(
    private fb: FormBuilder,
    private tillService: TillService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  form: FormGroup = this.fb.group({
    mora: [0, [Validators.required]]
  });

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({ id }) => this.tillService.getInstallment(id))
    )
      .subscribe({
        next: i => this.installment = i,
        error: _ => this.router.navigateByUrl('/alumnos/pagos/nuevo')
      });
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.installment) {
      return;
    }
    this.tillService.createMora(this.installment.id, this.form.value).subscribe(
      r => {
        Swal.fire('Bien Hecho', 'Mora creada', 'success');
        if (this.installment.payment.course_turn_student) {
          this.router.navigateByUrl(`/alumnos/pagos/${this.installment.payment.course_turn_student.id}`);
        }
        if (this.installment.payment.sale) {
          this.router.navigateByUrl(`/ventas/pagos/${this.installment.payment.sale.id}`);
        }
      }
    );
  }

  isInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }

}
