import prisma from "../../prisma/client";
import type {
  CreateOpportunityInput,
  UpdateOpportunityInput,
} from "./opportunity.schema";

export const createOpportunity = async (
  donorId: string,
  input: CreateOpportunityInput
) => {
  const { deadline, ...rest } = input;

  return await prisma.opportunity.create({
    data: {
      donorId,
      deadline: deadline ? new Date(deadline) : undefined,
      ...rest,
    },
    include: {
      donor: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          organizationName: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });
};

export const updateOpportunity = async (
  opportunityId: string,
  donorId: string,
  input: UpdateOpportunityInput
) => {
  const { deadline, ...rest } = input;

  // Verify ownership
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
  });

  if (!opportunity) {
    throw new Error("Opportunity not found");
  }

  if (opportunity.donorId !== donorId) {
    throw new Error("Unauthorized: You can only update your own opportunities");
  }

  return await prisma.opportunity.update({
    where: { id: opportunityId },
    data: {
      ...rest,
      deadline: deadline ? new Date(deadline) : undefined,
    },
    include: {
      donor: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          organizationName: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });
};

export const getOpportunities = async (filters: {
  category?: string;
  country?: string;
  isActive?: boolean;
  donorId?: string;
}) => {
  const where: any = {};

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  if (filters.donorId) {
    where.donorId = filters.donorId;
  }

  if (filters.category) {
    where.category = { has: filters.category };
  }

  if (filters.country) {
    where.countries = { has: filters.country };
  }

  return await prisma.opportunity.findMany({
    where,
    include: {
      donor: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          organizationName: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getOpportunityById = async (opportunityId: string) => {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: {
      donor: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          organizationName: true,
          organizationType: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  if (!opportunity) {
    throw new Error("Opportunity not found");
  }

  return opportunity;
};

export const deleteOpportunity = async (opportunityId: string, donorId: string) => {
  // Verify ownership
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
  });

  if (!opportunity) {
    throw new Error("Opportunity not found");
  }

  if (opportunity.donorId !== donorId) {
    throw new Error("Unauthorized: You can only delete your own opportunities");
  }

  await prisma.opportunity.delete({
    where: { id: opportunityId },
  });

  return { message: "Opportunity deleted successfully" };
};

