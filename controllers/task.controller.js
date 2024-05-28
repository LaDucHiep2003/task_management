
const Task = require("../models/task.model")
const paginationsHelper = require("../Helpers/pagination")
const searchStatusHelper = require("../Helpers/search")

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {

    // Status
    const find = {
        $or:[
            {createdBy : req.user.id},
            {listUser : req.user.id}
        ],
        deleted : false
    }

    if(req.query.status){
        find.status = req.query.status
    }

    // Sort
    const Sort = {

    }

    if(req.query.sortKey && req.query.sortValue){
        Sort[req.query.sortKey] = req.query.sortValue
    }

    // Pagination
    const countTasks = await Task.countDocuments(find)

    let objectPagination = paginationsHelper(
        {
            currentPage: 1,
            limitItems: 2
        },
        req.query,
        countTasks
    )

    // Search
    const objectSearch = searchStatusHelper(req.query)
    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }


    const tasks = await Task.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip).sort(Sort)
    res.json(tasks)
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    const taskId = req.params.id
    const tasks = await Task.findOne({
        _id : taskId,
        deleted : false
    })
    res.json(tasks)
}
// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {

    try{
        const id = req.params.id
        const status = req.body.status

        await Task.updateOne({
            _id : id
        },{
            status : status
        })

        res.json({
            code : 200,
            message : "Cập nhật trạng thái thành công"
        })
    }catch(error){
        res.json({
            code : 400,
            message : "Không tồn tại"
        })
    }
    
}

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeMulti = async (req, res) => {

    try{
        const {ids , key, value} = req.body

        switch (key) {
            case "status":
                await Task.updateMany({
                    _id : {$in : ids}
                },{
                    status : value
                })
                res.json({
                    code : 200,
                    message : "Cập nhật trạng thái thành công"
                })
                break;
            case "delete":
                await Task.updateMany({
                    _id : {$in : ids}
                },{
                    deleted : true,
                    deletedAt : new Date()
                })
                res.json({
                    code : 200,
                    message : "Xóa thành công"
                })
                break;
        
            default:
                res.json({
                    code : 400,
                    message : "Không tồn tại"
                })
                break;
        }
        
    }catch(error){
        res.json({
            code : 400,
            message : "Không tồn tại"
        })
    }
    
}

// [GET] /api/v1/task/create
module.exports.create = async (req, res) => {
    try{
        req.body.createdBy = req.user.id
        const task = new Task(req.body)
        const data = await task.save()

        res.json({
            code : 200,
            message : "Tạo thành công",
            data : data
        })

    }catch(error){
        res.json({
            code : 400,
            message : "Lỗi"
        })
    }
}

// [GET] /api/v1/task/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const id = req.params.id
        
        await Task.updateOne({
            _id : id
        },req.body)

        res.json({
            code : 200,
            message : "Cập nhật thành công! ",
        })

    }catch(error){
        res.json({
            code : 400,
            message : "Lỗi"
        })
    }
}


// [GET] /api/v1/task/delete/:id
module.exports.delete = async (req, res) => {
    try{
        const id = req.params.id
        
        await Task.updateOne({
            _id : id
        },{
            deleted : true,
            deletedAt : new Date()
        })

        res.json({
            code : 200,
            message : "Xóa thành công! ",
        })

    }catch(error){
        res.json({
            code : 400,
            message : "Lỗi"
        })
    }
}