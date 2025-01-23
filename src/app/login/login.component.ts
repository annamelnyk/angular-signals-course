import { Component, inject } from '@angular/core'
import { Router, RouterLink } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { MessagesService } from '../messages/messages.service'
import { FormBuilder, ReactiveFormsModule } from "@angular/forms"

@Component({
    selector: 'login',
    imports: [
        RouterLink,
        ReactiveFormsModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    fb = inject(FormBuilder)
    messagesService = inject(MessagesService)
    authService = inject(AuthService)
    router = inject(Router)

    loginForm = this.fb.group({
        email: [''],
        password: ['']
    })

    async onLogin() {
        const { email, password } = this.loginForm.value

        if (!email || !password) {
            this.messagesService.showMessage(
                'Enter email and password',
                'error'
            )

            return
        }

        try {
            await this.authService.login(email, password)
            await this.router.navigate(['/home'])

        } catch (err) {
            this.messagesService.showMessage(
                'Login failed',
                'error'
            )
        }
    }
}
