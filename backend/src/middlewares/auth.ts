import jwt from 'jsonwebtoken'
import { NextFunction, Request,Response } from 'express'
import { prisma } from '../lib/db'
import { userInfo } from 'os';

interface AuthRequest extends Request
{
    user?:{
        userId:string;
        email:string;
    };
}

export const authMiddleware = async (req:AuthRequest,res:Response,next:NextFunction
)=>{
try {
    const token = req.header('Authorization')?.replace('Bearer','');
    if(!token) return res.status(401).json({
        message:"No token provided"
    });
    const decoded =  jwt.verify(token,process.env.JWT_SECRET!) as any;


    // verify user still exists
    const user = await prisma.user.findUnique({
        where:{
            id:decoded.userId
        }
    });

    if(!user) return res.status(401).json({message:'User not found'});

    req.user = decoded;
    next();

} catch (error) {
    res.status(401).json({message:'Invalid token'})
}
};