import {Injectable, signal} from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  #loading = signal(false)

  loadingSignal = this.#loading.asReadonly()

  loadingOn() {
    this.#loading.set(true)
  }

  loadingOff() {
    this.#loading.set(false)
  }

}
