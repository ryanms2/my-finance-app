import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationsDropdown } from "@/components/notifications/NotificationsDropdown"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { auth } from "@/app/auth"
import { NavigationLink } from "@/components/navigation-link"
import { Settings, User } from "lucide-react"

export async function UserNav() {
  const session = await auth()
  const user = session?.user

  // Função para gerar iniciais do nome
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "US"
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Verificar se a imagem do usuário existe e formatá-la corretamente
  const userImage = user?.image ? `${user.image}?v=${Date.now()}` : null

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <NotificationsDropdown />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border border-gray-700">
              {userImage ? (
                <AvatarImage 
                  src={userImage} 
                  alt={user?.name || "Avatar do usuário"} 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                  {getInitials(user?.name)}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name || "Usuário"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <NavigationLink href="/settings">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
            </NavigationLink>
            <NavigationLink href="/settings">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
            </NavigationLink>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
