const axios = require('axios');
const UserTodos = require('../model/user.model');
const fetchUserInfoFromGoogle = async(bearerToken) => {
    let userInfo = {};
    await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
        { 'headers': { 'Authorization': 'Bearer ' + bearerToken } })
        .then((response) => {
            userInfo = response['data'];
        })
        .catch((err) => {
            console.log(err);
        });
    return new Promise((resolve) => {
        resolve(userInfo);
    });  
}

const fetchUserInfoFromDB = async(email) => {
    let userInfo = await UserTodos.findOne({email: email});
    return new Promise((resolve) => {
        resolve(userInfo);
    });
}

const updateUserTodos = async(userInfoFromGoogle, requestBody) => {
    let newUserResponse = await UserTodos.findOneAndUpdate(
        {email: userInfoFromGoogle['email']},
        {todos: requestBody.todos},
        {new: true}
    );
    console.log(newUserResponse);
    return new Promise((resolve) => {
        resolve(newUserResponse);
    })
}

const createNewUser = async (userInfo) => {
    try{
        let userCreated = await UserTodos.create(
                {
                    email: userInfo['email'],
                    name: userInfo['name'],
                    photo: userInfo['picture'],
                    todos: userInfo['todos']
                }
        );
        console.log(userCreated);
        return new Promise((resolve) => {
            resolve({
                email: userCreated.email,
                name: userCreated.name,
                photo: userCreated.photo,
                todos: userCreated.todos
            });
        });
    } catch(error){
        console.log(error);
        return new Promise((resolve) => {
            resolve(null);
        });
    }
} 

module.exports = {
    fetchUserInfoFromGoogle,
    fetchUserInfoFromDB,
    createNewUser,
    updateUserTodos
}