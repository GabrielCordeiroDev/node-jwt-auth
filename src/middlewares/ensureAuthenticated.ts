import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

interface IPayload {
  sub: string
}

export function ensureAuthenticated (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader) return res.status(401).json({ error: 'No token provided' })

  const parts = authHeader.split(' ')

  if (parts.length !== 2) return res.status(401).json({ error: 'Token error' })

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: 'Malformatted token' })

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload
    req.userId = sub
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' })
  }
}
