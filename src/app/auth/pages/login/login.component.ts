import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  ErrorMsg?: string;

  constructor(private router: Router, private fb: FormBuilder, private authSvc: AuthService, private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      Login: [localStorage.getItem('login') || '', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      Pswd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      recuerdame: [true],
    });
  }

  login() {
    this.authSvc.login(this.loginForm.value).subscribe(data => {
      if (this.loginForm.get('recuerdame')?.value){
        localStorage.setItem('login',this.loginForm.get('Login')?.value);
      } else {
        localStorage.removeItem('login');
      }
      this.router.navigateByUrl('/pages');
    }, (error) => {
      this.toastr.warning(error.error.msg, 'Inicio de Sesion', {
        timeOut: 3000,
      });
    });
  }
  
  isFieldValid(field: string) {
    if (
      this.loginForm.get(field)?.touched ||
      this.loginForm.get(field)?.dirty
    ) {
      if (!this.loginForm.get(field)?.valid) {
        this.setErrorMsg(field);
        return 'is-invalid';
      } else {
        return 'is-valid';
      }
    }
    return '';
  }

  setErrorMsg(field: string) {
    if (this.loginForm.get(field)?.errors?.['required'])
      this.ErrorMsg = 'El campo ' + field + ' es obligatorio';
    if (this.loginForm.get(field)?.errors?.['minlength'])
      this.ErrorMsg = 'El campo ' + field + ' debe tener al menos ' + this.loginForm.get(field)?.errors?.['minlength'].requiredLength + ' caracteres';
    if (this.loginForm.get(field)?.errors?.['maxlength'])
      this.ErrorMsg = 'El campo ' + field + ' no debe tener mas de ' + this.loginForm.get(field)?.errors?.['maxlength'].requiredLength + ' caracteres';
  }
}
