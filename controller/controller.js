const { fetchUserInfoFromGoogle, fetchUserInfoFromDB, createNewUser, updateUserTodos } = require("../service/service");
const catchAsync = require("../util/catchAsync")

const UserTodoUpdate = catchAsync(async(req, res) => {
    try{
        let requestBody = {...req.body};
        //{email, todos: [{id, text, isComplete}]}
        const authorizationHeader = req.headers["authorization"];
        const bearerToken = authorizationHeader.substring(7);
        if (authorizationHeader.substring(0, 6) !== "Bearer") {
            return res.status(httpStatus.PRECONDITION_REQUIRED).send({
              status: httpStatus.PRECONDITION_REQUIRED,
              message:
                "Access Token from Google is missing! Please Try again signing in to Google",
            });
        }
        let userInfoFromGoogle = await fetchUserInfoFromGoogle(bearerToken);
        if(userInfoFromGoogle['email'] !== requestBody.email){
            return res.status(401).send({
                status: 401,
                message: 'User Action not allowed'
            });
        }
        let newUserInfo = await updateUserTodos(userInfoFromGoogle, requestBody);
        if(newUserInfo){
           return res.status(200).send({
                status: 200,
                message: 'success',
                data: newUserInfo
           }); 
        }
        else {
            throw new Error('Unexpected Error');
        }
    } catch(error){
        console.log(error);
        return res.status(500).send({
            status: 500,
            message: 'Unexpected error'
        });
    }
});

const googleSignIn = catchAsync(async(req, res) => {
    try{
        const authorizationHeader = req.headers["authorization"];
        const bearerToken = authorizationHeader.substring(7);
        if (authorizationHeader.substring(0, 6) !== "Bearer") {
            return res.status(httpStatus.PRECONDITION_REQUIRED).send({
              status: httpStatus.PRECONDITION_REQUIRED,
              message:
                "Access Token from Google is missing! Please Try again signing in to Google",
            });
        }
        let userInfoFromGoogle = await fetchUserInfoFromGoogle(bearerToken);
        let userInfoFromDB = await fetchUserInfoFromDB(userInfoFromGoogle['email']);
        if(userInfoFromDB){
            return res.status(200).send({
                status: 200,
                message: 'success',
                data: userInfoFromDB
            });
        } else {
            //Create inside the DB.
            let userInfo = await createNewUser({
                email: userInfoFromGoogle['email'],
                name: userInfoFromGoogle['name'],
                picture: userInfoFromGoogle['picture'],
                todos: []
            });
            // let userInfo = await fetchUserInfoFromDB(userEmail);
            if(userInfo){
                return res.status(200).send({
                    status: 200,
                    message: 'success',
                    data: userInfo
                });
            } else {
                return res.status(500).send({
                    status: 500,
                    message: 'Failed to fetch User, Please login again'
                });
            }
        }
        // return res.status(200).send({status: 200, message:'success', data: {}});
    } catch(error){

    }
});

module.exports = {
    UserTodoUpdate,
    googleSignIn
}