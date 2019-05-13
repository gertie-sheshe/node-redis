const {clearHash} = require('../services/cache');

module.exports = async (req, res, next) => {

    // Called after route/request handler
    await next();

    clearHash(req.user.id)
}