import { hash, compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import jwt, { SignOptions } from 'jsonwebtoken';
import { users } from '../db/schema';
import { db } from '../db';
import { config } from '../config/config';
import express from 'express';

const router = express.Router();
// Registration route
router.post('/register', async (req: any, res: any) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    // Insert the new user
    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'user', // Default to 'user' if not specified
      })
      .returning({ id: users.id, email: users.email, role: users.role })
      .execute();

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Updated login route
router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (userResults.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResults[0];

    // Verify password
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      id: user.id.toString(),
      email: user.email,
      role: user.role
    };

    const signOptions: SignOptions = {
      expiresIn: config.jwt.expiresIn
    };

    const token = jwt.sign(
      payload,
      config.jwt.secret,
      signOptions
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const authRoutes = router;