module.exports = class Database{

    constructor({ user_name, password, name }){
        const that = this;
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                that.data = {};
                that.authorized = false;
        
                // Options
                that.user_name = user_name;
                that.password = password;
                that.name = name;

                resolve({
                    status:200,
                    message:`Successfully created the ${that.name} database`,
                    database:that
                })
            }, 5000);
        });
    }

    isAuthorized(){
        return this.authorized !== false;
    }

    insertData({ table, data }){
        return new Promise((resovle, reject) => {
            console.log('Is Authorized', !this.isAuthorized()," this.authorized: ", this.authorized);
            setTimeout(() => {
                if(!this.isAuthorized()){
                    reject({
                        status:403,
                        message:'403 Error, user is not authenticated to insert data.'
                    });
                }
    
                this.data = {...this.data, [table]:data};
                resovle({
                    status:200,
                    data:this.data
                });
            }, 5000);
        });
    }

    authenticate({ user_name, password }){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(this.isAuthorized()){
                    reject({
                        status:403,
                        message:'Error, user is already authenticated.'
                    });
                }
    
                const user_name_valid = user_name === this.user_name;
                const password_valid  = password  === this.password;

                console.log('User Name: ', user_name, ' equals ', this.user_name, " ", user_name_valid);
                console.log('Password: ', password, ' equals ', this.password, "  ", password_valid);

    
                if(user_name_valid && password_valid){
                    console.log('Authorized');
                    this.authorized = true;
    
                    resolve({
                        status:200,
                        message:'Successfully authenticated user'
                    })
                }
                
                console.log('Setting authorized to false');
                this.authorized = false;
    
                reject({
                    status:403,
                    message:'Incorrect credentials, user is not authenticated'
                })
            }, 5000);
        });
    }

    select_all_from(table){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(!this.isAuthorized()){
                    reject({
                        status:403,
                        message:'403 Error, user is not authenticated to select data.'
                    });
                }
    
                const found_table = this.data[table];
    
                if(found_table){
                    resolve({
                        status:200,
                        data:found_table
                    })
                }
    
                reject({
                    status:400,
                    message:`Unable to find data for table: <${table}>`
                });
            });
        });
    }
}