import { type Response } from "express";
import {
  uploadDocumentSchema,
  adminReviewSchema,
  fieldVisitSchema,
  assignFieldAgentSchema,
} from "./verification.schema";
import {
  uploadDocument,
  getPendingVerifications,
  adminReviewVerification,
  assignFieldAgent,
  getFieldAgentVerifications,
  createFieldVisit,
  completeFieldVerification,
  searchYouth,
} from "./verification.service";
import type { AuthRequest } from "../../middleware/auth.middleware";

export const uploadDocumentHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const validatedData = uploadDocumentSchema.parse(req.body);
    const document = await uploadDocument(req.userId, validatedData);
    res.status(201).json(document);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const getPendingVerificationsHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const verifications = await getPendingVerifications();
    res.status(200).json(verifications);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const adminReviewHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { verificationId } = req.params;
    const validatedData = adminReviewSchema.parse(req.body);
    const verification = await adminReviewVerification(
      verificationId,
      req.userId,
      validatedData
    );
    res.status(200).json(verification);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const assignFieldAgentHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { verificationId } = req.params;
    const validatedData = assignFieldAgentSchema.parse(req.body);
    const verification = await assignFieldAgent(verificationId, validatedData);
    res.status(200).json(verification);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const getFieldAgentVerificationsHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const verifications = await getFieldAgentVerifications(req.userId);
    res.status(200).json(verifications);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createFieldVisitHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const validatedData = fieldVisitSchema.parse(req.body);
    const visit = await createFieldVisit(req.userId, validatedData);
    res.status(201).json(visit);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const completeFieldVerificationHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { verificationId } = req.params;
    const { notes } = req.body;
    const verification = await completeFieldVerification(
      verificationId,
      req.userId,
      notes
    );
    res.status(200).json(verification);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const searchYouthHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { category, country, camp, status } = req.query;
    const filters = {
      category: category as string | undefined,
      country: country as string | undefined,
      camp: camp as string | undefined,
      status: status as string | undefined,
    };

    const results = await searchYouth(filters);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

