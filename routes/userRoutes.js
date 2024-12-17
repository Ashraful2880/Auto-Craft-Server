const express= require('express');
const {
     saveUser,
     updateUser,
     getUsers,
     updateAdminRole,
     checkAdminStatus 
} = require('../controllers/userController');

const router= express.Router();

router.post('/', saveUser); // Save User Info 
router.put('/', updateUser); // Update User Info 
router.get('/', getUsers); // Get All Users 
router.put('/admin', updateAdminRole); // Update Admin Role 
router.get('/:email', checkAdminStatus); // Get Admin Status 

module.exports= router;
