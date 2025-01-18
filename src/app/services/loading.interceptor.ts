import { HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http"
import { inject } from "@angular/core"
import { finalize } from "rxjs"

import { LoadingService } from "../loading/loading.service"

export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const loadingService = inject(LoadingService)

  loadingService.loadingOn()

  return next(req).pipe(
    finalize(() => loadingService.loadingOff())
  )
}