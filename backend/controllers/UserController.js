import UserModel from './../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const isUserEmailExisted = await UserModel.findOne({email: email});

        if(isUserEmailExisted){
            return res.status(400).json({message: 'User with this email already exists.'})
        }

        const isUserNameExisted = await UserModel.findOne({firstName: firstName, lastName: lastName});

        if(isUserNameExisted){
            return res.status(400).json({message: 'User with this name already exists.'})
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt);

        const doc = new UserModel({
            firstName: firstName[0].toUpperCase() + firstName.slice(1),
            lastName: lastName[0].toUpperCase() + lastName.slice(1),
            email,
            passwordHash: hash
        })

        const user = await doc.save();

        if (!user){
            return res.status(400).json({message: 'There is a problem with creating user.'})
        }

        const token = jwt.sign({id: user._id}, process.env.SECRET_JWT_KEY, {expiresIn: '1d'})

        const {passwordHash, ...userData} = user._doc

        res.status(201).json({...userData, token})

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong with registration...', error})
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        const user = await UserModel.findOne({email: email})

        if (!user){
            return res.status(418).json({message: 'Email or password is not correct.'})
        }

        const isValidPassword = bcrypt.compareSync(password, user.passwordHash)

        if (!isValidPassword){
            return res.status(418).json({message: 'Password is not correct.'})
        }

        const token = jwt.sign({id: user._id}, process.env.SECRET_JWT_KEY, {expiresIn: '1d'})
        
        if (!token){
            return res.status(400).json({message: 'Something went wrong...'})
        }

        const {passwordHash, ...userData} = user._doc

        res.status(202).json({...userData, token})

    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong with login...', error})
    }
}

export const edit = async (req, res) => {
    try {
        const userId = req.userId;
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        const user = await UserModel.findByIdAndUpdate(
            userId, 
            {email: email, firstName: firstName, lastName: lastName},
            {new: true}
            )
            .select('-passwordHash').
            exec()

        if (!user){
            return res.status(400).json({message: 'Something went wrong with editing the user...'})
        }

        res.json(user)
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong with editing the user...', error})
    }
}

export const getUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await UserModel.findById(userId);

        if (!user){
            return res.status(400).json({message: 'Something went wrong with finding the user...'})
        }

        const {passwordHash, ...userData} = user._doc;
        
        res.json({...userData})
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong with getting the user...', error})
    }
}

export const getProfile = async (req, res) => {
    try {
        const value = req.params.value;
        console.log(value);
        const firstName = value.split('_')[0];
        const lastName = value.split('_')[1];
        console.log('Take profile');
        const user = await UserModel.findOne({firstName: firstName, lastName: lastName}).select('-passwordHash').exec()

        if(!user){
            return res.status(400).json({message: 'Something went wrong with finding user profile...'})
        }

        res.json(user);

    } catch (error) { 
        console.log(error);
        return res.status(400).json({message: 'Something went wrong with finding user profile...', error})
    }
}