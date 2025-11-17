import prisma from "../../prisma/client";
import type {
  UploadDocumentInput,
  AdminReviewInput,
  FieldVisitInput,
  AssignFieldAgentInput,
} from "./verification.schema";

export const uploadDocument = async (userId: string, input: UploadDocumentInput) => {
  return await prisma.document.create({
    data: {
      userId,
      ...input,
    },
  });
};

export const getPendingVerifications = async () => {
  return await prisma.verification.findMany({
    where: { status: "PENDING" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          category: true,
          country: true,
          camp: true,
          community: true,
          documents: {
            select: {
              id: true,
              type: true,
              fileName: true,
              fileUrl: true,
              uploadedAt: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const adminReviewVerification = async (
  verificationId: string,
  adminId: string,
  input: AdminReviewInput
) => {
  const { status, notes } = input;

  return await prisma.verification.update({
    where: { id: verificationId },
    data: {
      status,
      adminId,
      adminNotes: notes,
      verifiedAt: status === "VERIFIED" ? new Date() : undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      admin: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
};

export const assignFieldAgent = async (
  verificationId: string,
  input: AssignFieldAgentInput
) => {
  return await prisma.verification.update({
    where: { id: verificationId },
    data: {
      fieldAgentId: input.fieldAgentId,
      status: "UNDER_REVIEW",
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          country: true,
          camp: true,
          community: true,
        },
      },
      fieldAgent: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
};

export const getFieldAgentVerifications = async (fieldAgentId: string) => {
  return await prisma.verification.findMany({
    where: { fieldAgentId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          category: true,
          country: true,
          camp: true,
          community: true,
          documents: {
            select: {
              id: true,
              type: true,
              fileName: true,
              fileUrl: true,
            },
          },
        },
      },
      fieldVisits: {
        orderBy: { visitDate: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const createFieldVisit = async (fieldAgentId: string, input: FieldVisitInput) => {
  const { verificationId, visitDate, notes, photos } = input;

  return await prisma.fieldVisit.create({
    data: {
      verificationId,
      fieldAgentId,
      visitDate: new Date(visitDate),
      notes,
      photos: photos || [],
    },
    include: {
      verification: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
};

export const completeFieldVerification = async (
  verificationId: string,
  fieldAgentId: string,
  notes?: string
) => {
  return await prisma.verification.update({
    where: { id: verificationId },
    data: {
      status: "VERIFIED",
      fieldNotes: notes,
      verifiedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      fieldVisits: {
        orderBy: { visitDate: "desc" },
      },
    },
  });
};

export const searchYouth = async (filters: {
  category?: string;
  country?: string;
  camp?: string;
  status?: string;
}) => {
  const where: any = {
    role: "YOUTH",
  };

  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.country) {
    where.country = filters.country;
  }
  if (filters.camp) {
    where.camp = { contains: filters.camp, mode: "insensitive" };
  }

  const users = await prisma.user.findMany({
    where,
    include: {
      verification: {
        where: filters.status ? { status: filters.status as any } : undefined,
      },
      documents: {
        select: {
          id: true,
          type: true,
          fileName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Filter by verification status if provided
  if (filters.status) {
    return users.filter((user) => user.verification?.status === filters.status);
  }

  return users;
};

