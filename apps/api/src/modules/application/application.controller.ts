import { type Response } from "express";
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
} from "./application.schema";
import {
  createApplication,
  getYouthApplications,
  getOpportunityApplications,
  updateApplicationStatus,
  getApplicationById,
} from "./application.service";
import type { AuthRequest } from "../../middleware/auth.middleware";

export const createApplicationHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const validatedData = createApplicationSchema.parse(req.body);
    const application = await createApplication(req.userId, validatedData);
    res.status(201).json(application);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const getYouthApplicationsHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const applications = await getYouthApplications(req.userId);
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOpportunityApplicationsHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { opportunityId } = req.params;
    const applications = await getOpportunityApplications(opportunityId, req.userId);
    res.status(200).json(applications);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const updateApplicationStatusHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { applicationId } = req.params;
    const validatedData = updateApplicationStatusSchema.parse(req.body);
    const application = await updateApplicationStatus(
      applicationId,
      req.userId,
      validatedData
    );
    res.status(200).json(application);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const getApplicationByIdHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { applicationId } = req.params;
    const application = await getApplicationById(applicationId, req.userId);
    res.status(200).json(application);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

