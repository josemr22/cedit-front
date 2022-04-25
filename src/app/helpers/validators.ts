import { AbstractControl, Validators } from "@angular/forms";
import { of } from "rxjs";
import { map } from "rxjs/operators";

export function validateOperation(control: AbstractControl, context: any) {
    if (!control.hasValidator(Validators.required)) {
        return of({});
    }

    return context.studentService.validateOperation(control.value).pipe(
        map(res => {
            return res ? {} : { operationTaken: true };
        })
    );
}