
const User = require("../models/user.model")

module.exports.requireAuth = async (req,res,next) =>{
    

    if(req.headers.authorization){
        const tokenUser = req.headers.authorization.split(" ")[1]

        const user = await User.findOne({ tokenUser : tokenUser, deleted : false}).select("-passWord -tokenUser")
        if(!user){
            res.json({
                code : 400,
                message : "tokenUser không hợp lệ"
            })
            return;
        }

        req.user = user
            
        next()
    }
    else{
        res.json({
            code : 400,
            message : "Vui lòng gửi kèm tokenUser"
        })
    }
    
}