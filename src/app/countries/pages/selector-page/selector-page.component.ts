import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { filter, map, switchMap, tap } from 'rxjs';
import { ISmallCountry } from '../../interfaces/country.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit{

  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService,
  ) {}

  get regions() {
    return this.countriesService.regions;
  }

  public countriesByRegion: ISmallCountry[] = [];
  public borders: ISmallCountry[] = [];

  public myForm: FormGroup = this.formBuilder.group({
    region: ['', Validators.required ],
    country: ['', Validators.required ],
    border: ['', Validators.required ],
  });

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }

  onRegionChange():void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('country')!.setValue('')),
        switchMap( region => this.countriesService.getCountriesByRegion( region ))
      )
      .subscribe( countries => this.countriesByRegion = countries)
  }

  onCountryChange() {
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('border')!.setValue('')),
        filter( (value: string) => value.length > 0),
        switchMap( alphaCode => this.countriesService.getCountryByAlphaCode( alphaCode )),
        switchMap( (country: ISmallCountry) => this.countriesService.getCountryBordersByCod( country.borders )
      ))
      .subscribe( counntries => this.borders = counntries)
  }

  onSubmit() {

    if ( this.myForm.invalid ) return;

    console.log(this.myForm.value)
  }
}
