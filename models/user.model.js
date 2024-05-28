const { default: mongoose } = require("mongoose");
const generate = require("../Helpers/generate")

const userSchema = new mongoose.Schema(
    {
        fullName : String,
        email : String,
        passWord : String,
        tokenUser : String,
        deleted : {
            type : Boolean,
            default : false
        },
        deletedAt : Date
    },{
        timestamps : true
    }
)

const User = mongoose.model('User', userSchema, 'users')

module.exports = User