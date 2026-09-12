import type { NextFunction, Request, Response } from "express";
export class ApiError extends Error { constructor(public status:number, public code:string, message:string){super(message);} }
export const errorHandler=(error:unknown,_req:Request,res:Response,_next:NextFunction)=>{const e=error instanceof ApiError?error:error&&typeof error==="object"&&"status" in error?error as ApiError:new ApiError(500,"INTERNAL_ERROR","An unexpected error occurred.");res.status(e.status).json({error:{code:e.code,message:e.message}});};
