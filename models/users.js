const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let users = new Schema(
    {
        user_id: {
            type: String
        },
        period: {
            type: String
        }
    },
    { collection: "Users" }
);

module.exports = mongoose.model("users", users);