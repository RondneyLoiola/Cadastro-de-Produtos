import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '../services/api';
import { useNavigate } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useState } from 'react';

interface UserType {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const Register = () => {
    const navigate = useNavigate();
    const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

    const schema = z.object({
        name: z.string().min(1, "Seu nome é necessário"),
        email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
        password: z
            .string()
            .min(6, "Senha é obrigatória")
            .min(6, "Senha deve ter no mínimo 6 caracteres"),
        confirmPassword: z
            .string()
            .min(6, "Confirmação de senha é obrigatória")
            .min(6, "Confirmação de senha deve ter no mínimo 6 caracteres"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "As senhas devem ser iguais",
        path: ["confirmPassword"],
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserType>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: UserType) => {
        try {
            const { status } = await api.post(
                '/user',
                {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                },
                {
                    validateStatus: () => true,
                },
            );

            if (status === 201 || status === 200) {
                setMensagem({ texto: "Conta criada com sucesso! Redirecionando para o login...", tipo: 'sucesso' });
                setTimeout(() => {
                    navigate("/entrar");
                }, 2300);
            } else if (status === 409 || status === 400) {
                setMensagem({ texto: "Email já cadastrado! Faça login para continuar.", tipo: 'erro' });
            } else {
                throw new Error();
            }
        } catch (_error) {
            setMensagem({ texto: "Falha no Sistema! Tente novamente.", tipo: 'erro' });
        }
    };

    return (
        <section className="h-screen flex flex-col items-center justify-center py-6 relative">
            {/* Mensagem Toast */}
            {mensagem && (
                <div
                    className={`fixed top-4 right-4 left-4 md:left-auto md:w-96 p-4 rounded-lg shadow-lg animate-slide-in ${
                        mensagem.tipo === 'sucesso'
                            ? 'bg-green-100 border border-green-400 text-green-700'
                            : 'bg-red-100 border border-red-400 text-red-700'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <p className="font-medium">{mensagem.texto}</p>
                        <button
                            onClick={() => setMensagem(null)}
                            className="ml-4 text-xl font-bold hover:opacity-70"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <div className='flex flex-col items-center justify-center w-110 p-4 bg-white rounded-xl border border-blue-100 shadow-2xl shadow-blue-100'>
                <div className='flex flex-col items-start justify-center gap-2 p-4'>
                    <h2 className='text-3xl font-bold'>Criar Conta</h2>
                    <p className='text-gray-500'>Preencha os campos abaixo para iniciar sua jornada com a ERP NEXUS</p>
                </div>
                <form className='w-full p-4 flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col'>
                        <Input label="Nome Completo" placeholder='Digite seu nome completo' type='text' {...register("name")} className={errors.name ? "border-red-500" : ""} />
                        {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
                    </div>

                    <div className='flex flex-col'>
                        <Input label="Email" placeholder='example@example.com' type='email' {...register("email")} className={errors.email ? "border-red-500" : ""} />
                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                    </div>

                    <div className='flex flex-col'>
                        <Input label="Senha" placeholder='Crie um senha forte' type='password' {...register("password")} className={errors.password ? "border-red-500" : ""} />
                        {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                    </div>

                    <div className='flex flex-col'>
                        <Input label="Confirmar senha" placeholder='Repita sua senha' type='password' {...register("confirmPassword")} className={errors.confirmPassword ? "border-red-500" : ""} />
                        {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword.message}</p>}
                    </div>
                    <Button type="submit">Cadastrar</Button>
                    <div className='flex flex-col gap-4 items-center justify-center'>
                        <div className='w-full border-b border-blue-100'/>
                        <p className='text-center'>Ja possui uma conta? <span className='text-blue-500 cursor-pointer' onClick={() => navigate("/entrar")}>Faça Login</span></p>
                    </div>
                </form>
            </div>
        </section>
    )
}