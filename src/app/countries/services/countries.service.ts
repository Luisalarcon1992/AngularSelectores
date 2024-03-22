import { Injectable } from '@angular/core';
import { ICountry, ISmallCountry, Region } from '../interfaces/country.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map, of, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private http: HttpClient ) { }

  private _regions: Region[] = [Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania];

  private _baseUrl: string =  'https://restcountries.com/v3.1';

  //https://restcountries.com/v3.1/region/americas?fields=cca3,name,borders


  get regions(): Region[] {

    return [ ...this._regions ];
  }

  getCountriesByRegion( region: Region ): Observable<ISmallCountry[]> {

    if ( !region ) return of([]);

    const url = `${this._baseUrl}/region/${region}?fields=cca3,name,borders`

    return this.http.get<ICountry[]>( url )
    .pipe(
      map( countries => countries.map( country => ( {
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? []
      })))
    );
  }


  getCountryByAlphaCode( alphaCode: string ): Observable<ISmallCountry> {

    if ( !alphaCode ) return of();

    const url = `${this._baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;

    return this.http.get<ICountry>(url)
      .pipe(
        map( country => ( {
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        }) )
      )

  }

  getCountryBordersByCod( borders: string[]): Observable<ISmallCountry[]> {
    if ( !borders || borders.length === 0 ) return of([]);

    const requests: Observable<ISmallCountry>[] = [];

    borders.forEach( alphaCode => {
      requests.push( this.getCountryByAlphaCode( alphaCode ) );
    });

    return combineLatest( requests );

  }
}


