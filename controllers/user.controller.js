
const md5 = require("md5")
const User = require("../models/user.model")
const generateHelper = require("../Helpers/generate")
const ForgotPassword = require("../models/forgot-password.model")
const sendMailHeplper = require("../Helpers/sendMail")
// [GET] /api/v1/users/register
module.exports.register = async (req, res) => {

    req.body.passWord = md5(req.body.passWord)

    const existEmail = await User.findOne({
        email : req.body.email,
        deleted : false
    })
    if(existEmail){
        res.json({
            code : 400,
            message : "Email đã tồn tại"
        })
    }else{
        const user = new User({
            fullName : req.body.fullName,
            email : req.body.email,
            passWord : req.body.passWord,
            tokenUser : generateHelper.generateRandomString(30)
        })
        user.save()
        
        const tokenUser = user.tokenUser

        res.cookie("tokenUser", tokenUser)
        res.json({
            code : 200,
            message : "Tạo tài khoản thành công",
            tokenUser : tokenUser
        })
    }
   
    
}

// [GET] /api/v1/users/login
module.exports.login = async (req, res) => {

    const email = req.body.email
    const passWord = req.body.passWord

    const user = await User.findOne({
        email : email,
        deleted : false
    })

    if(!user){
        res.json({
            code : 400,
            message : "Email không tồn tại"
        })
        return;
    }
    if(md5(passWord) !== user.passWord){
        res.json({
            code : 400,
            message : "Sai mật khẩu"
        })
        return;
    }
    const tokenUser = user.tokenUser

    res.cookie("tokenUser", tokenUser)
    res.json({
        code : 200,
        message : "Đăng nhập thành công",
        tokenUser : tokenUser
    })
}

// [GET] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {

    const email = req.body.email
    const user = await User.findOne({
        email : email,
        deleted : false
    })

    if(!user){
        res.json({
            code : 400,
            message : "Email không tồn tại"
        })
        return;
    }

    // Luu thong tin vao data base
    const otp = generateHelper.generateRandomNumber(8)

    const objectForgotPassword = {
        email : email,
        otp : otp,
        expireAt : Date.now()
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword)
    forgotPassword.save()


    // Neu ton tai email thi gui ma opt qua email
    const subject = "Mã opt xác minh lấy lại mật khẩu"
    const html = `Mã otp lấy lại mật khẩu là <b>${otp} </b>. Thời hạn sử dụng là 3 phút.`

    sendMailHeplper.sendMail(email,subject, html)
    res.json({
        code : 200,
        message : "Đã gửi mã Otp qua email",
    })
}

// [GET] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {

    const email = req.body.email
    const otp = req.body.otp

    const result = await ForgotPassword.findOne({
        email : email,
        otp : otp
    })

    if(!result){
        res.json({
            code : 400,
            message : "Mã otp không lợp lệ"
        })
        return;
    }
    const user = await User.findOne({
        email : email
    })
    res.cookie("tokenUser",user.tokenUser)

    res.json({
        code : 200,
        message : "Xác thực thành công",
        tokenUser : user.tokenUser
    })
}

// [GET] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {

    const passWord = req.body.passWord

    const tokenUser = req.body.tokenUser
   
    const user = await User.findOne({
        tokenUser : tokenUser
    })

    if(md5(passWord) === user.passWord){
        res.json({
            code : 400,
            message : "Vui lòng nhập mật khẩu mới khác mật khẩu cũ",
        })
        return;
    }
    await User.updateOne({
        tokenUser : tokenUser
    },{
        passWord : md5(passWord)
    })
    res.json({
        code : 200,
        message : "Đổi mật khẩu thành công",
    })
}

// [GET] /api/v1/users/password/detail
module.exports.detail = async (req, res) => {


    res.json({
        code : 200,
        message : "Thành công",
        info : req.user
    })
}

// [GET] /api/v1/users/list
module.exports.list = async (req, res) => {

    const user = await User.find({deleted : false}).select("fullName email")
    
    res.json({
        code : 200,
        message : "Thành công",
        users : user
    })
}
