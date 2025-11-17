import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";
import { JWT_SECRET } from "../../middleware/auth.middleware";
import type { RegisterInput, LoginInput } from "./auth.schema";

const SALT_ROUNDS = 10;

export const registerUser = async (input: RegisterInput) => {
  const { email, password, dateOfBirth, ...rest } = input;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      ...rest,
    },
  });

  // Create verification record for youth
  if (user.role === "YOUTH") {
    await prisma.verification.create({
      data: {
        userId: user.id,
        status: "PENDING",
      },
    });
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user: userWithoutPassword, token };
};

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: {
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      firstName: userWithoutPassword.firstName,
      lastName: userWithoutPassword.lastName,
      role: userWithoutPassword.role,
    },
    token,
  };
};

