import { AuthService } from './../../auth/auth.service';
import { Items } from './items.model';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })

export class ItemsService {

    item3DUrlFile = new Subject<string>();
    charType = {
        'Male': [{ name: 'Adult Male' }, { name: 'Boy' }],
        'Female': [{ name: 'Adult Female' }, { name: 'Girl' }]
    }
    itemCharacterForm = {
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
    ItemSubTypes = {
        'Adult Male': {
            Clothes: [
               { name: 'Shirt' },{ name: 'T-Shirt' }, { name: 'Jacket' }, { name: 'Jeans' }
            ],
            Accessories: [
                { name: 'Shoes' }, { name: 'Bag' },{name:'Cap'}/*,{ name: 'Leather' }*/
            ],
            /*
            Perfumes: [
                { name: 'Edu Toilet' }, { name: 'Edu Perfume' }
            ],
            'Skin Care': [
                { name: 'Face Care' }, { name: 'Body Care' }
            ]
            */
        },

        "Adult Female": {
            Clothes: [
                { name: 'Dress' }, { name: 'Blouses' }, { name: 'T-Shirt' }, { name: 'Shirt' },{ name: 'Skirt' }, { name: 'Jacket' }, { name: 'Jeans' }
            ],
            Accessories: [
                { name: 'Shoes' }, { name: 'Bag' },{ name: 'Hijab' }/*, { name: 'Leather' }*/
            ],
            /*
            Perfumes: [
                { name: 'Edu Toilet' }, { name: 'Edu Perfume' }
            ],
            'Skin Care': [
                { name: 'Face Care' }, { name: 'Body Care' }
            ]
            */
        },
        /*
        "Adult Uni-sex": {
            Clothes: [
                { name: 'T-Shirt' }, { name: 'Jeans' }
            ],
            Accessories: [
                { name: 'Shoes' }, { name: 'Bag' }, { name: 'Leather' }
            ],

            Perfumes: [
                { name: 'Edu Toilet' }, { name: 'Edu Perfume' }
            ],
            'Skin Care': [
                { name: 'Face Care' }, { name: 'Body Care' }
            ]
        },
        */
        "Teen Male": {
            Clothes: [
               { name: 'Shirt' }, { name: 'T-Shirt' }, { name: 'Jacket' }, { name: 'Jeans' }
            ],
            Accessories: [
                { name: 'Shoes' }, { name: 'Bag' },{ name: 'Cap' }/*, { name: 'Leather' }*/
            ],
            /*
            Perfumes: [
                { name: 'Edu Toilet' }, { name: 'Edu Perfume' }
            ],
            'Skin Care': [
                { name: 'Face Care' }, { name: 'Body Care' }
            ]*/
        },

        "Teen Female": {
            Clothes: [
                { name: 'Dress' },{ name: 'Blouses' }, { name: 'T-Shirt' }, { name: 'Jacket' }, { name: 'Jeans' }
            ],
            Accessories: [
                { name: 'Shoes' }, { name: 'Bag' }/*, { name: 'Leather' }*/
            ],
            /*
            Perfumes: [
                { name: 'Edu Toilet' }, { name: 'Edu Perfume' }
            ],
            'Skin Care': [
                { name: 'Face Care' }, { name: 'Body Care' }
            ]*/
        },
        /*
        "Teen Uni-sex": {
            Clothes: [
                { name: 'Shirt' }, { name: 'Jeans' }
            ],
            Accessories: [
                { name: 'Shoes' }, { name: 'Bag' }, { name: 'Leather' }
            ],

            Perfumes: [
                { name: 'Edu Toilet' }, { name: 'Edu Perfume' }
            ],
            'Skin Care': [
                { name: 'Face Care' }, { name: 'Body Care' }
            ]
        },*/
        'Boy': {
            Clothes: [
               { name: 'Shirt' }, { name: 'T-Shirt' }, { name: 'Jacket' }, { name: 'Jeans' }
            ],
            Accessories: [
                { name: 'Shoes' }, { name: 'Bag' }/*, { name: 'Leather' }*/
            ],
            /*
                      Perfumes: [
                          { name: 'Edu Toilet' }, { name: 'Edu Perfume' }
                      ],
                      'Skin Care': [
                          { name: 'Face Care' }, { name: 'Body Care' }
                      ]*/
        },
        'Girl': {
            Clothes: [
                { name: 'Dress' }, { name: 'T-Shirt' }, { name: 'Jacket' }, { name: 'Jeans' }
            ],
            Accessories: [
                { name: 'Shoes' }, { name: 'Bag' }/*, { name: 'Leather' }*/
            ],
            /*
          Perfumes: [
              { name: 'Edu Toilet' }, { name: 'Edu Perfume' }
          ],
          'Skin Care': [
              { name: 'Face Care' }, { name: 'Body Care' }
          ]*/
        },
    }

    itemSize = {
        'US Standard': {
            'T-Shirt': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            'Shirt': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            'Jacket': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            'Jeans': ['24', '26', '28', '30', '32', '34', '36'],
            'Dress': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            'Skirt': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        }

        // 'EU Standard': [],
        // 'Numbers': []
    }
    constructor(private http: HttpClient, private authService: AuthService) { }

    private apiUrl = environment.apiUrl;
    token;
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

    getAllitems(): Observable<Items[]> {
        return this.http.get<Items[]>(this.apiUrl + ':6060/items/all', this.getToken()).pipe(
            catchError(this.handleError)
        );
    }

    getOneItem(id: number): Observable<Items> {
        return this.http.get<Items>(this.apiUrl + ':6060/items/item/' + id, this.getToken()).pipe(
            catchError(this.handleError)
        );
    }

    addItem(item: Items): Observable<Items[]> {
        return this.http.post<Items[]>(this.apiUrl + ':6060/items/add', item, this.getToken()).pipe(
            catchError(this.handleError)
        );
    }

    deleteitem(id: number): Observable<Items[]> {
        return this.http.delete<Items[]>(this.apiUrl + ':6060/items/delete/' + id, this.getToken()).pipe(
            catchError(this.handleError)
        );
    }
    updateOneItem(item: Items) {
        return this.http.put(this.apiUrl + ':6060/items/update',  item, this.getToken())
    }

    uploadFiles(id: number, file, type) {
        return this.http.post<any>(this.apiUrl + ':4040/items/' + id + '/' + type, file, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            map(event => this.getEventMessage(event, file, 'files')),
            catchError(this.handleError)
        );
    }
    uploadFile(id: number, file, type) {
        return this.http.post<any>(this.apiUrl + ':4040/items/' + id + '/' + type, file, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            map(event => this.getEventMessage(event, file, 'file')),
            //catchError(this.handleError)
        );
    }
    private getEventMessage(event: HttpEvent<any>, file, num) {

        switch (event.type) {
            case HttpEventType.UploadProgress:
                return this.fileUploadProgress(event);
                break;
            case HttpEventType.Response:
                return this.apiResponse(event);
                break;
            default:
                return `File "${file.get(num).name}" surprising upload event: ${event.type}.`;
        }
    }
    private fileUploadProgress(event) {
        const percentDone = Math.round(100 * event.loaded / event.total);
        return { status: 'progress', message: percentDone };
    }

    private apiResponse(event) {
        return event.body;
    }
    deleteFile(id: number, item) {
        return this.http.delete<any>(this.apiUrl + ':4040/items/' + id + '/' + item).pipe(
            catchError(this.handleError)
        );
    }

    copyItem(newId: number, oldId: number) {
        return this.http.post(this.apiUrl + ':4040/items/clone', { newId: newId, oldId: oldId }).pipe(
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