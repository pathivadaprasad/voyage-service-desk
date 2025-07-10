import { api, LightningElement, track, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
    @api selectedBoatId;
    boatTypeId = '';
    isLoading = false;
    @track boats;
    @track draftValues = [];

    columns = [
        { label: 'Name', fieldName: 'Name', editable: true },
        { label: 'Length', fieldName: 'Length__c', type: 'number' },
        { label: 'Price', fieldName: 'Price__c', type: 'currency' },
        { label: 'Description', fieldName: 'Description__c' }
    ];

    @wire(MessageContext)
    messageContext;

    @wire(getBoats, { boatTypeId: '$boatTypeId' })
    wiredBoats({ data, error }) {
        if (data) {
            this.boats = data;
        } else if (error) {
            console.error('Error fetching boats:', error);
        }
    }

    // Public method to trigger search
    @api
    searchBoats(boatTypeId) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.boatTypeId = boatTypeId;
    }

    // Public method to refresh boat data
    @api
    async refresh() {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        await refreshApex(this.boats);
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    updateSelectedTile(event) {
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
    }

    sendMessageService(boatId) {
        publish(this.messageContext, BOATMC, { recordId: boatId });
    }

    handleSave(event) {
        const updatedFields = event.detail.draftValues;

        updateBoatList({ data: updatedFields })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: SUCCESS_TITLE,
                        message: MESSAGE_SHIP_IT,
                        variant: SUCCESS_VARIANT
                    })
                );
                this.draftValues = [];
                return this.refresh();
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: ERROR_TITLE,
                        message: error.body.message,
                        variant: ERROR_VARIANT
                    })
                );
            });
    }

    // ✅ Corrected this line (added `new`)
    notifyLoading(isLoading) {
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }
}
