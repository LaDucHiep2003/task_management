

const taskRouters = require('./task.route')
const usersRouters = require('./user.route')
const authMiddleware = require("../middlewares/auth.middleware")
module.exports = (app) =>{

    app.use('/api/v1/tasks',authMiddleware.requireAuth, taskRouters)
    app.use('/api/v1/users', usersRouters)
}