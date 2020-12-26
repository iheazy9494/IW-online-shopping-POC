import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import {

    HttpEvent,

    HttpInterceptor,

    HttpHandler,

    HttpRequest,

    HttpResponse,

    HttpErrorResponse

} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { retry, catchError } from 'rxjs/operators';


@Injectable({ providedIn: "root" })
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(public authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)

            .pipe(

                retry(1),

                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = `Error: ${error.error.message}`;
                    }
                    else if (error.status == 401) {
                        this.authService.logout();
                        location.reload(true);
                    }
                    else {
                        // server-side error
                        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                    }
                    //window.alert(errorMessage);
                    return throwError(errorMessage);
                })

            )

    }

}
