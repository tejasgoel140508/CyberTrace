import { z } from "zod"; export const iocSearchSchema=z.object({value:z.string().trim().min(1).max(2048)});
