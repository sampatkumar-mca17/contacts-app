class ContactsService{
    apiPrefix;
    
    constructor(prefix){
        this.setApiPrefix(prefix);
    }

    setApiPrefix(prefix){
        this.apiPrefix = prefix;
    }

    async getAllContacts(){
        try{
            const contactsResp = await fetch(`${this.apiPrefix}/contacts`)
            return await contactsResp.json();
        }
        catch(e){
           return 'failed'
        }
    }

    async addContact(data){
        try{
            const createResp = await fetch(`${this.apiPrefix}/contacts`,{
                method:'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            return 'success'
        }
        catch (e){
            return 'failed'
        }
    }

    async updateContact(id,data){
        try{
            const updateResp = await fetch(`${this.apiPrefix}/contacts/${id}`,{
                method:'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            return 'success'
        }
        catch (e){
            return 'failed'
        }
    }

    async deleteContact(id){
        try{
            const deleteResp = await fetch(`${this.apiPrefix}/contacts/${id}`,{
                method:'DELETE',
            })
            return 'deleted'
        }
        catch (e){
            return 'failed'
        }
    }
}

export {ContactsService}
