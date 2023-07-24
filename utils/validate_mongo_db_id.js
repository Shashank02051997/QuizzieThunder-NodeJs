const mongoose = require('mongoose');

const validateMongoDbId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {
    validateMongoDbId,
};
