import { z } from "zod";
import { inngest } from "@/inngest/client";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/db";
import { TRPCError } from "@trpc/server";

export const messageRouter = createTRPCRouter({
  getMany: protectedProcedure // ← Must be logged in
    .input(
      z.object({      // ← Input validation: requires projectId     
        projectId: z.string().min(1, { message: "Project is Required" }),
      }),
    )
    .query(async ({input , ctx}) => { // ← .query = this is a READ operation
      const messages = await prisma.message.findMany({
        where :{
          projectId:input.projectId,
          project :{// ← Only YOUR messages
            userId: ctx.auth.userId!,
          }
        },
        orderBy: {
          updatedAt: "asc",
        },
        include: {
          fragment: true,
        },
      });
      return messages;// ← This is what the client receives
    }),
  create: protectedProcedure
    .input(  // ← Requires value + projectId
      z.object({
        value: z
          .string()
          .min(1, { message: "Message is Required" })
          .max(10000, { message: "Message is too long" }),
        projectId: z.string().min(1, { message: "Project is Required" }),
      }),
    )
    .mutation(async ({ input,ctx }) => { // ← .mutation = this WRITES data
      const existingProject = await prisma.project.findUnique({
        where : {
          id: input.projectId,
          userId: ctx.auth.userId!,
        }
      })
      if(!existingProject){
        throw new TRPCError({code:"NOT_FOUND", message:"Project Not Found"})
      }
      const createdMessage = await prisma.message.create({
        data: {
          projectId: existingProject.id,
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });
      await inngest.send({
        name: "code-agent/run",
        data: { value: input.value, projectId: input.projectId },
      });
      return createdMessage;
    }),
});