import { Download, download } from './download';
import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpRequest } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { SAVER, Saver } from './saver.provider'

@Injectable({ providedIn: 'root' })
export class DownloadService {

    constructor(
        private http: HttpClient,
        @Inject(SAVER) private save: Saver
    ) {
    }

    // download(url: string, filename?: string): Observable<any> {
    //     return this.http.get(url, {
    //         reportProgress: true,
    //         observe: 'events',
    //         responseType: 'blob'
    //     }).pipe(download(blob => this.save(blob, filename)))
    // }
    download(url: string, filename?: string): Observable<any> {
        return this.http.get(url, {
            reportProgress: true,
            observe: 'events',
            responseType: 'blob'
        }).pipe(download(blob => console.log(blob)))
    }

    blob(url: string, filename?: string): Observable<Blob> {
        return this.http.get(url, {
            responseType: 'blob'
        })
    }
}