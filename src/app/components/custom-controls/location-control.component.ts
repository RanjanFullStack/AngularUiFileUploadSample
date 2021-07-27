﻿import { ChangeDetectorRef, Component, forwardRef, Input, OnChanges, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';



@Component({
	selector: 'location-control',
	templateUrl: './location-control.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => LocationControlComponent),
			multi: true
		}, { provide: NG_VALIDATORS, useExisting: forwardRef(() => LocationControlComponent), multi: true }
	]
})

export class LocationControlComponent implements OnInit, OnChanges, ControlValueAccessor  {
	 

	@Input('location') location: any = {};
	@Input() cityRequired: boolean
	@Input() stateRequired: boolean
	@Input() countryRequired: boolean
	@Input() regionRequired: boolean
	@Input() loadingCountry: boolean
	@Input() loadingRegion: boolean


	private cityListByCountry: any=[];
	private _locationMaster: any = {};

	get locationMaster(): any {
		// transform value for display
		return this._locationMaster;
	}

	@Input()
	set locationMaster(locationMaster: any) {

		this._locationMaster = locationMaster;

		let region = this.location.region;
		let country = this.location.country;
		if (region != undefined && region != null && country != undefined && country != null) {

			this.location.country = undefined;
			setTimeout(() => {

				this.location.region = this._locationMaster.regionList.filter(function (element: any, index: any) {
					return element.regionId == region.regionId;
				})[0];

				this.location.country = this._locationMaster.countryList.filter(function (element: any, index: any) {
					return element.countryId == country.countryId;
				})[0];

				if (this.location.country != undefined && this.location.country.countryId > 0 && (this._locationMaster.stateList == null || this._locationMaster.stateList == undefined || this._locationMaster.stateList.length == 0)) {
					this.GetLocationListByCountryId();
				}

				if (this.location.state != undefined && this.location.state.stateId > 0 && (this._locationMaster.cityList == null || this._locationMaster.cityList == undefined || this._locationMaster.cityList.length == 0)) {
					this.GetLocationListByStateId();
				}
			}, 0);
		}
	}


	loadingState = false;
	loadingCity = false;
	constructor(private miscellaneousService: MiscellaneousService, private accountService: AccountService, protected changeDetectorRef: ChangeDetectorRef) {

	}
	

	ngOnChanges() {
		

		if (this.location == null || !Object.keys(this.location).length) {
			//this.form.form.markAsPristine();
			//this.form.reset();
		}
		else {
			let region = this.location.region;
			let country = this.location.country;
			if (this._locationMaster.regionList != null && region!=null) {
				this.location.region = this._locationMaster.regionList.filter(function (element: any, index: any) {
					return element.regionId == region.regionId;
				})[0];
			}
			if (this._locationMaster.countryList != null && country !=null) {
				this.location.country = this._locationMaster.countryList.filter(function (element: any, index: any) {
					return element.countryId == country.countryId;
				})[0];
			}

			if (this.location.country != undefined && this.location.country.countryId > 0 && (this._locationMaster.stateList == null || this._locationMaster.stateList == undefined || this._locationMaster.stateList.length == 0)) {
				this.GetLocationListByCountryId();
			}
			else {
				this._locationMaster.stateList = [];
				this._locationMaster.cityList = [];
				this.cityListByCountry = [];
			}

			if (this.location.state != undefined && this.location.state.stateId > 0 && (this._locationMaster.cityList == null || this._locationMaster.cityList == undefined || this._locationMaster.cityList.length == 0)) {
				this.GetLocationListByStateId();
			}
			else {
				this._locationMaster.cityList = [];
			}
		}

	}

	ngOnInit() {
	}

	onCountryChange() {
		this.location.state = undefined;
		this.location.city = undefined;
		this._locationMaster.stateList = [];
		this._locationMaster.cityList = [];
		this.GetLocationListByCountryId();

	}

	onStateChange() {
		this.location.city = undefined;
		this._locationMaster.cityList = [];
		this.GetLocationListByStateId();

	}
	onRegionChange() {
		this.location.state = undefined;
		this.location.city = undefined;
		this.location.country = undefined;
		this._locationMaster.countryList = [];
		this._locationMaster.stateList = [];
		this._locationMaster.cityList = [];
		this.GetCountryListByRegionId();

	}
	GetCountryListByRegionId() {
		this.loadingCountry = true;
		let regionId = this.location.region == undefined ? 0 : this.location.region.regionId;
		this.miscellaneousService.getCountryListByRegionId(regionId)
			.subscribe((data) => {
				this._locationMaster.countryList = data["body"];

				if (this.location.country != null && this.location.country.countryId > 0) {
					let countryId = this.location.country.countryId;
					this.location.country = this._locationMaster.countryList.filter(function (element: any, index: any) { return element.countryId == countryId; })[0];
				}

				this.onLocationChange();
				this.loadingCountry = false;
			}, error => { this.loadingCountry = false; this.accountService.redirectToLogin(error); })
		this.onLocationChange();
	}

	GetLocationListByCountryId() {

		if (this.location.country != undefined) {
			this.loadingState = true;
			this.loadingCity = true;
			this.miscellaneousService.GetLocationListByCountryId(this.location.country.countryId)
				.subscribe((data) => {
					this._locationMaster.stateList = data["body"].stateList;
					this._locationMaster.cityList = data["body"].cityList;
					if (data["body"].cityList) {
						this.cityListByCountry = JSON.parse(JSON.stringify(data["body"].cityList));
					}
					
					if (this.location.state != null && this.location.state.stateId > 0) {
						let stateId = this.location.state.stateId;
						this.location.state = this._locationMaster.stateList.filter(function (element: any, index: any) { return element.stateId == stateId; })[0];
					}
					else {
						this.location.state = undefined;
					}


					this.onLocationChange();
					this.loadingState = false;
					this.loadingCity = false;

				}, error => { this.loadingState = false; this.loadingCity = false; this.accountService.redirectToLogin(error); })

		}
		//else
		{
			this._locationMaster.stateList = [];
			this._locationMaster.cityList = [];
			this.cityListByCountry = [];

			this.onLocationChange();
		}
	}

	GetLocationListByStateId() {
		if (this.location.state != undefined) {
			this.loadingCity = true;
			this.miscellaneousService.GetLocationListByStateId(this.location.state.stateId)
				.subscribe((data) => {
					this._locationMaster.cityList = data["body"].cityList;

					if (this.location.city != null && this.location.city.cityId > 0) {
						let cityId = this.location.city.cityId;
						this.location.city = this._locationMaster.cityList.filter(function (element: any, index: any) { return element.cityId == cityId; })[0];
					}

					this.onLocationChange();
					this.loadingCity = false;
				}, error => { this.loadingCity = false; this.accountService.redirectToLogin(error); })
		}
		else {
			if (this.cityListByCountry) {
				this._locationMaster.cityList = JSON.parse(JSON.stringify(this.cityListByCountry));
			}
			else {
				this._locationMaster.cityList = [];
			}
			
			if (this.location.city != null && this.location.city.cityId > 0) {
				let cityId = this.location.city.cityId;
				this.location.city = this._locationMaster.cityList.filter(function (element: any, index: any) { return element.cityId == cityId; })[0];
			}
			
		}
		this.onLocationChange();
	}


	onLocationChange() {
		if (this.location == null || this.location == undefined) {
			this.location = {};
		}

		this.propagateChange(this.location);
	}

	writeValue(value: any) {
		if (value !== undefined && value != null) {
			this.location = value;
		}

	}

	propagateChange = (_: any) => { };

	registerOnChange(fn: any) {
		this.propagateChange = fn;
	}

	registerOnTouched() { }

	validate(c: FormControl) {

		let isValid = true;
		if (c.value == null) {
			isValid = false;
		}
		else {
			if (this.regionRequired && (c.value.region == undefined || c.value.region == "undefined")) {
				isValid = false;
			}
			if (this.countryRequired && (c.value.country == undefined || c.value.country == "undefined")) {
				isValid = false;
			}
			if (this.stateRequired && (c.value.state == undefined || c.value.state == "undefined")) {
				isValid = false;
			}
			if (this.cityRequired && (c.value.city == undefined || c.value.city == "undefined")) {
				isValid = false;
			}
		}
		if (isValid) {
			return null;
		}
		else {
			return {
				validateRequired: {
					valid: false
				}
			}
		}



	}

	public resetLocationForm() {
		
	}
}
