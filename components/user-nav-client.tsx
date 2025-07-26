"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import Link from "next/link"
import { NavigationLink } from "@/components/navigation-link"

interface UserNavClientProps {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserNavClient({ user }: UserNavClientProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <NotificationsDropdown />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border border-gray-700">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name || 'Usuário'}</p>
              <p className="text-xs leading-none text-gray-400">
                {user?.email || 'usuario@exemplo.com'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <NavigationLink href="/settings">
                Perfil
              </NavigationLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavigationLink href="/settings">
                Configurações
              </NavigationLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuItem>
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
