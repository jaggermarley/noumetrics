import { compare, hash } from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'

// Função para criar um token de autenticação
export async function createAuthToken(userId: string): Promise<string> {
  // Em produção, use um JWT ou outro método seguro
  // Para simplificar, usaremos apenas o ID do usuário como token
  return userId
}

// Função para verificar a senha
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

// Função para hash da senha
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

// Função para login
export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    throw new Error('Senha incorreta')
  }

  const token = await createAuthToken(user.id)
  
  // Definir o cookie de autenticação
  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 semana
    path: '/',
  })

  return { user, token }
}

// Função para obter o usuário atual
export async function getCurrentUser() {
  const token = cookies().get('auth-token')?.value

  if (!token) {
    return null
  }

  // Em produção, verifique o JWT
  // Para simplificar, usamos o token como ID do usuário
  const user = await prisma.user.findUnique({
    where: { id: token },
    include: {
      company: true,
    },
  })

  return user
}

// Função para verificar autenticação em rotas protegidas
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

// Função para logout
export async function logout() {
  cookies().delete('auth-token')
}

