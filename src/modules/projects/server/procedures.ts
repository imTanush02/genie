import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { generateSlug } from "random-word-slugs";
import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/db";

export const projectsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({          
        id: z.string().min(1, { message: "id is Required" }),
      }),
    )
    .query(async ({input}) => {
      const existingProject = await prisma.project.findUnique({
        where :{
          id :input.id
        },
        include: {
          messages: {
            include: {
              fragment: true,
            },
          },
        },
      });
      if(!existingProject){
        throw new TRPCError({code:"NOT_FOUND", message:"Project Not Found"})
      }
      return existingProject;
    }),
  getMany: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: {
          include: {
            fragment: true,
          },
        },
      },
    });
    return projects;
  }),
  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Message is Required" })
          .max(10000, { message: "Message is too long" }),
      }),
    )
    .mutation(async ({ input }) => {
      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });
      await inngest.send({
        name: "code-agent/run",
        data: { value: input.value, projectId: createdProject.id },
      });
      return createdProject;
    }),
});
