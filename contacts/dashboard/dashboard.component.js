import { API_PREFIX, CONTACT_ERRORS, CONTACT_COLUMNS, SAVE_CONTANCT_CONSTANT, UPDATE_CONTACT_CONSTANT } from "../constants/constants.js";
import { ContactsService } from "../services/contacts.service.js";
import {resetErrors, validate} from "../helpers/contacts.validator.js";

class DashboardComponent {
    contactService
    contacts
    addContactListener;
    errors = CONTACT_ERRORS
    constructor(){
        this.contactsService = new ContactsService(API_PREFIX);
        this.contacts = this.getAllContacts();
        this.updateTableWithContacts()
        this.addEventListenerToAddContact()

    }
    /**API Calls start */

    //  Retrieve all contacts
    async getAllContacts(){
     this.toggleLoader(true);
     const contacts =  await this.contactsService.getAllContacts()
     this.toggleLoader(false);
     if(typeof contacts === 'string' && contacts === 'failed'){
        alert('Contacts fetch failed, please try again in sometime')
        this.toggleTableView(false);
        return [];
     }
     this.toggleTableView(contacts.length > 0);
     return contacts;
    }
    
    // Add new contact
    async save(){
        const {name, email, number, place} = this.getAddContactDialogElements()
        if(!validate(name, number, email, place, this.errors)){
            this.showErrors()
            return;
        }
        resetErrors(this.errors)
        this.showErrors()
        const data = this.getAddContactDialogElements()
        this.toggleLoader(true)
        const status = await this.contactsService.addContact(data)
        if(status === 'success'){
            alert('Contact added successfully')
            this.contacts = await this.getAllContacts()
            this.updateTableWithContacts()
        }
        else{
            alert('Failed to add contact, please try again')
            this.toggleLoader(false)
        }
        this.hideDialog()
    
    }

    // Update contact
    async update(id){
        const {name, email, number, place} = this.getAddContactDialogElements()
        if(!validate(name, number, email, place, this.errors)){
            this.showErrors()
            return;
        }
        resetErrors(this.errors)
        this.showErrors()
        const data = this.getAddContactDialogElements()
        this.toggleLoader(true)
        const status = await this.contactsService.updateContact(id, data)
        if(status === 'success'){
            alert('Contact updated successfully')
            this.contacts = await this.getAllContacts()
            this.updateTableWithContacts()
        }
        else{
            alert('Failed to add contact, please try again')
            this.toggleLoader(false)
        }
        this.hideDialog()
    }
    // Delete contact
    async delete(id){
        this.toggleLoader(true);
        const status = await this.contactsService.deleteContact(id);
        if(status === 'deleted'){
            alert('Contact deleted successfully')
            this.contacts = await this.getAllContacts()
            this.updateTableWithContacts()
        }
        else{
            alert('Failed to delete contact')
            this.toggleLoader(false)
        }
    }


     /**API Calls end */

    /**DOM updates start*/
    // toggles loader whenever, this is used to show loading indicator when api calls are happening
    toggleLoader(show){
            document.getElementById('loader').style.display = show?'block':'none'
            document.getElementById('data-container').style.display = show?'none':'block'
    }
    // updates the table with contacts fetched from API
    async updateTableWithContacts(){
        const contacts = await this.contacts
        const tableHeading = document.getElementById('tableHead');
        const tableBody = document.getElementById('tableBody');
        this.clearTableData(tableHeading, tableBody);
        const columnHeadings = Object.keys(contacts[0])
        this.updateTableHeading(columnHeadings, tableHeading)
        this.updateTableBody(contacts, columnHeadings, tableBody)

    }
    // clears table data before updating with the new ones
    clearTableData(tableHeading, tableBody){
        tableHeading.innerHTML = ''
        tableBody.innerHTML = ''
    }
    // updates table heading
    updateTableHeading(columnHeadings, tableHeading){
        let tableHeadHTML = document.createElement('tr')
        columnHeadings.forEach(columnHeading =>{
            const th = document.createElement('th');
            th.innerHTML = columnHeading.toUpperCase();
            tableHeadHTML.appendChild(th)
        })
        tableHeading.appendChild(tableHeadHTML)
    }

    // updates table body
    updateTableBody(contacts, columnHeadings, tableBody){
        contacts.forEach((contact)=>{
            const tr = document.createElement('tr')
            columnHeadings.forEach(columnHeading =>{
                const td = document.createElement('td')
                td.innerHTML = contact[columnHeading]
                td.setAttribute('id',columnHeading)
                tr.appendChild(td)
            })

            const td = document.createElement('td');
            const editAnchorTag = document.createElement('a');
            const deleteAnchorTag = document.createElement('a');
            editAnchorTag.setAttribute('id','edit-contact-'+contact._id)
            deleteAnchorTag.setAttribute('id','delete-contact-'+contact._id)

            this.updateStylesAndInnerHTMLOfEditAndDeleteTags(editAnchorTag, deleteAnchorTag, contact)
            td.appendChild(editAnchorTag)
            td.appendChild(deleteAnchorTag)
            tr.appendChild(td)
            tr.setAttribute('id',contact._id)
            tableBody.appendChild(tr)
        })
       
    }
    // Styles for the delete and edit anchor tags in the table
    addStylesToEditAndDeleteTags(editAnchorTag, deleteAnchorTag){
        editAnchorTag.style.cursor = 'pointer'
        editAnchorTag.style.color = '#A7A1AE'
        editAnchorTag.style.textDecoration = 'underline'
        editAnchorTag.style.marginRight = '10px';

        deleteAnchorTag.style.color ='#FB667A'
        deleteAnchorTag.style.textDecoration = 'underline'
        deleteAnchorTag.style.marginRight = '10px';
        deleteAnchorTag.style.cursor = 'pointer'
    }

    // handler for adding style and event listeners to each edit and delete anchor or each table row
    updateStylesAndInnerHTMLOfEditAndDeleteTags(editAnchorTag, deleteAnchorTag, contact){
        // inner html for a tags
        editAnchorTag.innerHTML = 'Edit'
        deleteAnchorTag.innerHTML = 'Delete'
        // styles for a tags
        this.addStylesToEditAndDeleteTags(editAnchorTag, deleteAnchorTag)  
        this.addEventListenerToEditAndDeleteTags(editAnchorTag, deleteAnchorTag, contact)
    }

    // based on we're adding the contact or updating the contact adds the buttons and functionalities to button
    addSaveAndCancelButtonToDialog(type){
        const dialog = document.getElementById('add-contact-dialog');
        this.removeButtonsFromDialog(dialog, SAVE_CONTANCT_CONSTANT);
        this.removeButtonsFromDialog(dialog, UPDATE_CONTACT_CONSTANT);
        const div = this.createSaveAndCancelButton(type)
        dialog.appendChild(div)

    }
    // creates save and cancel button and adds it to a div
    createSaveAndCancelButton(type){
        const div = document.createElement('div');
        const saveButton = document.createElement('button');
        const cancelButton = document.createElement('button');
        this.addStylesToSaveButton(saveButton, type)
        this.addStylesToCancelButton(cancelButton)
        div.appendChild(saveButton)
        div.appendChild(cancelButton)
        this.addStylesToParentDivOfDialogButtons(div, type)
        return div
        
    }
    // styling for the parent div
    addStylesToParentDivOfDialogButtons(div, type){
        div.setAttribute('id',type+'-div')
        div.style = `position:relative;left:1rem;bottom:1rem`
    }

    // styling for the save button
    addStylesToSaveButton(saveButton, type){
        saveButton.setAttribute('id',type)
        saveButton.innerHTML = 'Save'
        saveButton.style = `position:relative;right:1rem;background-color:#E19D17;`
        saveButton.style.marginBottom = '1rem'

    }
    // styling for the cancel button
    addStylesToCancelButton(cancelButton){
        cancelButton.setAttribute('id','cancel')
        cancelButton.innerHTML = 'Cancel'
    }
    // removes the existing save and cancel buttons before adding the new ones
    removeButtonsFromDialog(dialog, type){
        const existingSaveButtonDiv = dialog.querySelector(`#${type}-div`);
        if(existingSaveButtonDiv){
            dialog.removeChild(existingSaveButtonDiv)
        }

    }
    // opens the dialog box
    showDialog(){
        document.getElementById('add-contact-dialog').open = true;
    }

    // resets the data of dialog box
    resetDialg(){
        document.getElementById('contact-name').value = '';
        document.getElementById('contact-number').value = '';
        document.getElementById('contact-email').value = '';
        document.getElementById('contact-place').value = '';
        resetErrors(this.errors)
        this.showErrors()
    }

    // closes the dialog box, this is also a event listener callback
    hideDialog(){
        document.getElementById('add-contact-dialog').open = false;
    }

    // retrieves the data added in the dialog dialog box
    getAddContactDialogElements(){
        const name = document.getElementById('contact-name').value;
        const number = document.getElementById('contact-number').value;
        const email = document.getElementById('contact-email').value;
        const place = document.getElementById('contact-place').value;
        return {name, number, email, place}
    }

    // updates the data to the dialog box (this method is used in case of edit)
    updateAddContactDialogElements(data){
        document.getElementById('contact-name').value = data.name;
        document.getElementById('contact-number').value = data.number;
        document.getElementById('contact-email').value = data.email;
        document.getElementById('contact-place').value = data.place;
    }


    // renders the validation errors(if any)
    showErrors(){
        document.getElementById('contact-name-error').innerHTML = this.errors.name
        document.getElementById('contact-email-error').innerHTML = this.errors.email
        document.getElementById('contact-number-error').innerHTML = this.errors.number
        document.getElementById('contact-place-error').innerHTML = this.errors.place
    }

    /**DOM updates end */


    /**Event listeners start */

    /**
     * this calls either save() method or update() method 
     * based on whether the user is updating existing contact or adding new contact
     * */ 
    addSaveContactListener(type, id){
        const func = type === SAVE_CONTANCT_CONSTANT ? this.save.bind(this) : this.update.bind(this, id)
        document.getElementById(type).addEventListener('click',func)
        document.getElementById('cancel').addEventListener('click',this.hideDialog.bind(this))
    }

    // event listeners for editing the table row or deliting the table row
    addEventListenerToEditAndDeleteTags(editAnchorTag, deleteAnchorTag, contact) { 
        editAnchorTag.addEventListener('click',this.editContact.bind(this, contact._id))
        deleteAnchorTag.addEventListener('click',   this.deleteContact.bind(this, contact._id))
    }

    // click listener for add contact button
    addEventListenerToAddContact(){
        this.addContactListener =  document.getElementById('add-contact').addEventListener('click',this.addContact.bind(this,SAVE_CONTANCT_CONSTANT));
    }

    // views or hides table
    toggleTableView(show){
            document.getElementById("table-container").style.display = show?"table":'none';
            document.getElementById('no-data').style.display = show?'none':'flex'
    }

    /**Event listeners end */

    
    /**Event listener callbacks start */

    /** callback for add contact event listener, 
     * i.e whenever add contact button or edit contact button is clicked this opens dialog 
     * and creates buttons and adds respective functionalities
     * */
    addContact(type, id){
        this.showDialog()
        this.resetDialg()
        this.addSaveAndCancelButtonToDialog(type);
        this.addSaveContactListener(type, id)
    }

    /* 
        callback for edit conatact event listener
        i.e whenever edit contact button is clicked this opens dialog
        and creates buttons and adds respective functionalities
    */
    editContact(id){
        const tr = document.getElementById(id);
        const trData = Array.from(tr.children)
        const dataToBeUpdated = {}
        trData.forEach(contact => {
            if(contact.id && CONTACT_COLUMNS.includes(contact.id)){
                dataToBeUpdated[contact.id] = contact.innerHTML
            }
        })
        this.addContact(UPDATE_CONTACT_CONSTANT, id)
        this.updateAddContactDialogElements(dataToBeUpdated)
    }

    /* 
        callback for delete contact event listener
        i.e whenever delete contact button is clicked this opens confirmation dialog
        if user confirms calls the api for deleting the contact
    */
    deleteContact(id){
        const confirmation = confirm('Are you sure you want to delete this contact?')
        if(!confirmation){
            return;
        }
        this.delete(id)
    }

    /**Event listeners callbacks end */

}

const dc = new DashboardComponent();