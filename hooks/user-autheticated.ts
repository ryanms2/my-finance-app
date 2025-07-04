import { auth } from "@/app/auth";
import { prisma } from "@/utils/prisma/prisma";

export async function useUserAutheticated(email: string) {
    console.log(email)
    const idUser = await prisma.user.findUnique({
        where: {
            email: email ?? ""
        }
    })

    return idUser?.id
}