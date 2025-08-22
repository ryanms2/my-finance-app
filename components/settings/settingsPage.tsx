import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { UserNav } from "@/components/user-nav"
import { MobileMenu } from "@/components/mobile-menu"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProfileForm } from "@/components/settings/ProfileForm"
import { DeleteAccount } from "@/components/settings/DeleteAccount"
import { NotificationSettings } from "../notifications/NotificationSettings"

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface SettingsPageProps {
  user: User | null;
}

export function SettingsPage({ user }: SettingsPageProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      <Sidebar />
      <MobileMenu />
      <div className="flex-1 overflow-auto pb-20 lg:pb-0">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center">
            <h1 className="text-xl font-bold ml-10 lg:ml-0">Configurações</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <UserNav />
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-gray-800/50 mb-6">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="account">Conta</TabsTrigger>
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="system">Sistema</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                  <CardDescription className="text-gray-400">Atualize suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm user={user} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Configurações da Conta</CardTitle>
                  <CardDescription className="text-gray-400">Gerencie as configurações da sua conta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Autenticação em Dois Fatores</p>
                        <p className="text-sm text-gray-400">Adicione uma camada extra de segurança (em breve)</p>
                      </div>
                      <Switch disabled />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-400">Excluir Conta</p>
                        <p className="text-sm text-gray-400">Exclua permanentemente sua conta</p>
                      </div>
                      <DeleteAccount userEmail={user?.email || null} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Aparência</CardTitle>
                  <CardDescription className="text-gray-400">Personalize a aparência do aplicativo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Tema</p>
                        <p className="text-sm text-gray-400">Escolha entre tema claro ou escuro</p>
                      </div>
                      <ThemeToggle />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cor Principal</p>
                        <p className="text-sm text-gray-400">Escolha a cor principal do aplicativo</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer ring-2 ring-white"></div>
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-teal-500 cursor-pointer"></div>
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 cursor-pointer"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Preferências
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure suas preferências de notificação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <NotificationSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
