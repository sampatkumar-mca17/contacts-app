const API_PREFIX = 'https://phonebook-dev.onrender.com'
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const CONTACT_ERRORS = {
    name: '',
    email: '',
    number: '',
    place: ''
}
const CONTACT_COLUMNS = ['name', 'email', 'number', 'place']
const SAVE_CONTANCT_CONSTANT ='save-contact'
const UPDATE_CONTACT_CONSTANT = 'update-contact'

export {API_PREFIX ,EMAIL_REGEX, CONTACT_ERRORS, CONTACT_COLUMNS, SAVE_CONTANCT_CONSTANT, UPDATE_CONTACT_CONSTANT}