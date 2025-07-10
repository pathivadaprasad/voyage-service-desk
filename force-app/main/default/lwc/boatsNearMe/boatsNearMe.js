import { api, LightningElement } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';

export default class BoatsNearMe extends LightningElement {
    @api boatTypeId;

    mapMarkers = [];
    isLoading = true;
    isRendered = false;
    latitude;
    longitude;

    renderedCallback() {
        if (!this.isRendered) {
            this.isRendered = true;
            this.getLocationFromBrowser();
        }
    }

    getLocationFromBrowser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.fetchBoats(); // Now fetch data
            }, error => {
                this.showToast(ERROR_TITLE, error.message, ERROR_VARIANT);
                this.isLoading = false;
            });
        } else {
            this.showToast(ERROR_TITLE, 'Geolocation is not supported by this browser.', ERROR_VARIANT);
            this.isLoading = false;
        }
    }

    fetchBoats() {
        getBoatsByLocation({
            latitude: this.latitude,
            longitude: this.longitude,
            boatTypeId: this.boatTypeId
        })
        .then(result => {
            this.createMapMarkers(result);
        })
        .catch(error => {
            this.showToast(ERROR_TITLE, error.body?.message || error.message, ERROR_VARIANT);
        })
        .finally(() => {
            this.isLoading = false;
        });
    }

    createMapMarkers(boatData) {
        const newMarkers = JSON.parse(boatData).map(boat => {
            return {
                title: boat.Name,
                location: {
                    Latitude: boat.Geolocation__Latitude__s,
                    Longitude: boat.Geolocation__Longitude__s
                }
            };
        });

        newMarkers.unshift({
            title: LABEL_YOU_ARE_HERE,
            icon: ICON_STANDARD_USER,
            location: {
                Latitude: this.latitude,
                Longitude: this.longitude
            }
        });

        this.mapMarkers = newMarkers;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}
