import { api } from "./api-client"; import type { AuthSession } from "../utils/storage";
export const login = (email:string,password:string) => api<AuthSession>("/auth/login",{method:"POST",body:JSON.stringify({email,password})});
