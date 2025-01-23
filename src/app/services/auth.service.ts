import { computed, effect, inject, Injectable, signal } from "@angular/core"
import { User } from "../models/user.model"
import { environment } from "../../environments/environment.development"
import { Router } from "@angular/router"
import { HttpClient } from "@angular/common/http"
import { firstValueFrom } from "rxjs"

const USER_STORAGE_KEY = 'angular-university-user'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #userSignal = signal<User | null>(null)
  user = this.#userSignal.asReadonly()
  isLoggedIn = computed(() => !!this.user())

  http = inject(HttpClient)

  constructor() {
    this.initAuthService()
  }

  initAuthService() {
    const loggedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (loggedUser) {
      this.#userSignal.set(JSON.parse(loggedUser) as User)
    }

  }
  
  async login(email: string, password: string): Promise<User> {
    const loggedUser$ = this.http.post<User>(`${environment.apiRoot}/login`, { email, password })
    const user = await firstValueFrom(loggedUser$)

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    this.#userSignal.set(user)

    return user
  }

  async logout() {
    localStorage.removeItem(USER_STORAGE_KEY)
    this.#userSignal.set(null)
  }

}
