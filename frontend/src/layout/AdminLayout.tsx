import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Outlet } from "react-router"
import { useUser } from "../hook/auth";

export const AdminLayout = () => {
    const { userInfo } = useUser()
    
    if(userInfo?.isAdmin) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="grow py-6 mt-16">
                    <Outlet />
                </main>
                <Footer/>
            </div>
        )
    } else {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex gap-2 text-center flex-col">
                    <h1 className="text-4xl text-red-700">Acesso Negado</h1>
                    <p className="text-2xl text-red-500">Somente administradores podem acessar essa tela</p>
                </div>
            </div>
        )
    }
}