import UserModel from './../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'; 

export const register = async (req, res) => {
    try {
        const { nickname, level, email, password, avatarURL } = req.body;

        const isUserEmailExisted = await UserModel.findOne({email: email});

        if(isUserEmailExisted){
            return res.status(400).json({message: 'User with this email already exists.'})
        }

        const isUserNicknameExisted = await UserModel.findOne({nickname: nickname});

        if(isUserNicknameExisted){
            return res.status(400).json({message: 'User with this nickname already exists.'})
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt);

        const doc = new UserModel({
            nickname: nickname[0].toUpperCase() + nickname.slice(1),
            level: level,
            email,
            passwordHash: hash,
            avatarURL: avatarURL,
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
        const nickname = req.body.nickname;
        const level = req.body.level;
        const avatarURL = req.body.avatarURL;

        const user = await UserModel.findByIdAndUpdate(
            userId, 
            {email: email, nickname: nickname, level: level, avatarURL: avatarURL},
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
        if (req.userId){
            const userId = req.userId;

            const user = await UserModel.findById(userId);

            if (!user){
                return res.status(400).json({message: 'Something went wrong with finding the user...'})
            }

            const {passwordHash, ...userData} = user._doc;
            
            res.json({...userData})
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong with getting the user...', error})
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select('-passwordHash');

        if(!users){
            res.status(400).json({message: 'No users were found'})
        }

        res.status(200).json(users)
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: 'Something went wrong with getting all users... ', error})
    }
}

export const getProfile = async (req, res) => {
    try {
        const value = req.params.value;
        const nickname = value.split('_')[0];
        const user = await UserModel.findOne({nickname: nickname}).select('-passwordHash').exec()

        if(!user){
            return res.status(400).json({message: 'Something went wrong with finding user profile...'})
        }

        res.json(user);

    } catch (error) { 
        console.log(error);
        return res.status(400).json({message: 'Something went wrong with finding user profile...', error})
    }
}