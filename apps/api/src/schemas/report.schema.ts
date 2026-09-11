import { z } from "zod";
export const reportSchema = z.object({ iocId: z.string().optional(), attackProfileId: z.string().optional(), title: z.string().trim().min(1).max(160).optional() }).refine(v => v.iocId || v.attackProfileId, "iocId or attackProfileId is required");
