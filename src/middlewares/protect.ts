import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { UnauthorizedError } from '../utils/AppError'
import prisma from '../config/prisma'

export const protect = async (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }

    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token)

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, avatar: true }
    })

    if (!user) throw new UnauthorizedError('User not found')

    req.user = user
    next()
  } catch {
    next(new UnauthorizedError('Invalid token'))
  }
}