import { catchError } from 'rxjs/operators';
import { character } from './character.model';
import { AuthService } from './../../auth/auth.service';
import { Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})

export class charactersService implements OnInit {

    characterUrlFile = new Subject<string>();
    characterUrlType = new Subject<string>();
    characterSkinColor = new Subject<string>();
    characterHairColor = new Subject<string>();
    characterEyeColor = new Subject<string>();


    charType = {
        'Male': [{ name: 'Adult Male' }, { name: 'Boy' }],
        'Female': [{ name: 'Adult Female' }, { name: 'Girl' }]
    };

    characterForm = {
        'Adult Male': [
             { name: 'skkiny'},
             { name: 'skkiny-fat'},
             { name: 'normal'},
             { name: 'muscular'},
             { name: 'ex-muscular'},
             { name: 'fat'},
             { name: 'ex-fat'}
            ],
        'Adult Female': [
             { name: 'skkiny'},
             { name: 'pregnant-skkiny'},
             { name: 'skkiny-fat'},
             { name: 'normal'},
             { name: 'pregnant-normal'},
             { name: 'fat'},
             { name: 'pregnant-fat'},
             { name: 'ex-fat'},
             { name: 'pregnant-ex-fat'},
            ]
    };

    private apiUrl = environment.apiUrl + ':5055/characters/';
    token;

    constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

    ngOnInit() {

    }
    getToken() {
        if (localStorage.getItem('user') != null) {
            this.token = JSON.parse(localStorage.getItem('user')).token

        } else {
            this.authService.logout();
        }
        let headers =
            new HttpHeaders({
                'Content-type': 'application/json',
                'Authorization': 'Bearer' + this.token
            });

        let options = {
            headers: headers
        }
        return options;
    }
    characterFilter(): Observable<character[]> {

        // return this.http.get<chracter[]>(this.apiUrl + 'all', this.getToken()).pipe(
        //     catchError(this.handleError)
        // );
        return this.http.get<character[]>(this.apiUrl + 'all', this.getToken())
    }

    characterDelete(id: number) {
        return this.http.delete(this.apiUrl + 'character/' + id, this.getToken())
    }

    getOneCharacter(id: number): Observable<character> {
        return this.http.get<character>(this.apiUrl + 'character/' + id, this.getToken()).pipe(
            catchError(this.handleError)
        );
    }

    addCharacter(character: character): Observable<character> {
        return this.http.post<character>(this.apiUrl + 'add', character, this.getToken())
    }

    updateOneCharacter(character: character): Observable<character> {
        return this.http.put<character>(this.apiUrl + 'character', character, this.getToken()).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        return throwError('Something bad happened. Please try again later.');
    }
}
