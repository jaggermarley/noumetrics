import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas públicas que não exigem autenticação
const publicRoutes = ["/login"]

export function middleware(request: NextRequest) {
  // Verificar se existe um token de autenticação
  const isAuthenticated = request.cookies.has("auth-token")

  // Verificar se o usuário está tentando acessar uma rota protegida
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Se o usuário não estiver autenticado e tentar acessar uma rota protegida,
  // redirecionar para a página de login
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Se o usuário estiver autenticado e tentar acessar a página de login,
  // redirecionar para o dashboard
  if (isAuthenticated && isPublicRoute) {
    const dashboardUrl = new URL("/", request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

// Configurar o middleware para ser executado em todas as rotas
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}

