require('dotenv').config()

const { ObjectId } = require('mongodb');
const {getDb}=require('../utils/mongoConnection')


const COLLECTION_NAME='users';


class SignUp{
    constructor(username, password, email,profession) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.profession = profession; // Optional field
    }

    save(){
        const db=getDb()
        db.collection(COLLECTION_NAME).insertOne(this)
            .then(result => {
                console.log('User signed up successfully:', result);
            })
            .catch(err => {
                console.error('Error signing up user:', err);
            });
    }

    static handleOtp(email){
        const db=getDb()
        return db.collection(COLLECTION_NAME).findOne({email})
    }

    static handleLogin(email){
        const db=getDb()
        return db.collection(COLLECTION_NAME).findOne({email})
    }

    static updateOtpToUser(email,otp){
        const db=getDb()
        return db.collection(COLLECTION_NAME).updateOne({email},{$set:{otp}})
    }

    static removeOtp(email){
        const db=getDb()
        return db.collection(COLLECTION_NAME).updateOne({email},{$unset:{otp:1}})
    }
        
}

module.exports = SignUp;