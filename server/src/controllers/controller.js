
//website

const { userRegister, userLogin, viewUserData, updateUserData, genrateOtpToUpdate, updateUserPassword, verifyEmail} = require("./website/userController");

module.exports={
    userRegister,
    userLogin,
    viewUserData,
    updateUserData,
    genrateOtpToUpdate,
    updateUserPassword,
    verifyEmail
}