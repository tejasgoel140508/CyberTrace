import type { NextFunction, Request, Response } from "express"; import jwt from "jsonwebtoken"; import { env } from "../config/env"; import { ApiError } from "./error.middleware";
export type AuthRequest=Request&{user?:{id:string;email:string;name:string}};
export function authenticate(req:AuthRequest,_res:Response,next:NextFunction){try{const token=req.header("authorization")?.replace(/^Bearer\s+/i,"");if(!token)throw new Error();req.user=jwt.verify(token,env.jwtSecret) as AuthRequest["user"];next();}catch{next(new ApiError(401,"UNAUTHORIZED","Authentication is required."));}}
