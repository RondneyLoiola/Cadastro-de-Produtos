import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { api } from '../services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router';

interface LoginType {
    email: string;
    password: string;
}

export const Login = () => {
    const navigate = useNavigate();
    const schema = z.object({
		email: z.email("Insira um E-mail inválido"),
		password: z
			.string()
			.min(8, "Senha deve ter no mínimo 8 caracteres"),
	});

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginType>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: LoginType) => {
        try {
            const { data: user } = await api.post('/session', {
                email: data.email,
                password: data.password
            });
        } catch (_error) {
            alert('Falha no Sistema! Tente novamente.');
        }
    }

    return (
        <section className="h-screen flex flex-col items-center justify-center py-6">
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col items-start justify-center gap-2'>
                    <h1 className='text-4xl font-extrabold'>Bem-Vindo ao ERP NEXUS</h1>
                    <p className='text-gray-500 text-xl'>Faça login para acessar sua conta</p>
                </div>
                <div className='flex flex-col items-center justify-center w-110 p-4 bg-white rounded-xl border border-blue-100 shadow-2xl shadow-blue-100'>
                    <form className='w-full p-4 flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
                        <div className='flex flex-col'>
                            <Input placeholder="example@example.com" label="E-mail" type="email" {...register('email')} />
                        </div>
                        <div className='flex flex-col'>
                            <Input placeholder="Insira sua Senha de Acesso" label="Senha" type="password" {...register('password')} />
                        </div>
                        <Button type='submit'>Entrar</Button>
                        <div className='flex flex-col gap-4 items-center justify-center'>
                            <div className='w-full border-b border-blue-100'/>
                            <p className='text-center'>Ainda não tem conta? <span className='text-blue-500 cursor-pointer' onClick={() => navigate("/cadastro")}>Faça o Cadastro</span></p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}