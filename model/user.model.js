const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
    },
    todos: [
        {
            id: {type: Number, required: true},
            text: {type: String, required: true},
            isComplete: {type: Boolean, default: false},
        }
    ]
});

const UserTodos = mongoose.model("userTodos", UserSchema);
module.exports = UserTodos;
