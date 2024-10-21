'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import Image from 'next/image';

const Page = () => {
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSignup, setIsSignup] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  useEffect(() => {
    /*const token = localStorage.getItem('token');
        if (token) {
            router.push('/');
        }*/
  }, [router]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    /*e.preventDefault();
        try {
          const url = isSignup
            ? "http://localhost:3001/signup"
            : "http://localhost:3001/login";
          const body = JSON.stringify({ email, password });
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: body,
          });
          if (!response.ok) {
            const errorMessage = await response.text();
            setErrorMessage(errorMessage);
            throw new Error(errorMessage);
          }
          const data = await response.json();
          const token = data.token;
          localStorage.setItem('token', token);
          const userId = data.userId;
          localStorage.setItem("userId", userId);
          const userEmail = data.email;
          localStorage.setItem("userEmail", userEmail);
          const role = data.is_admin;
          localStorage.setItem("role", role);
          window.location.href = "/profile";
        } catch (error) {
          console.error("Erreur lors de la connexion :", error);
          setErrorMessage("Identifiants incorrects. Veuillez réessayer.");
        }*/
    router.push('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-primary-dark-blue bg-cover bg-center">
      <div
        className="w-[420px] bg-transparent border-0 md:border-2 border-white/20 backdrop-blur-[20px] shadow-lg text-white rounded-lg p-8"
        style={{
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="flex justify-center mt-5 mb-10">
          <Image
            src="/images/Logo_ESEO_GROUPE.jpg"
            alt="Logo"
            width={300}
            height={200}
            className="object-contain object-center"
          />
        </div>
        <div className="relative w-full my-6">
          <input
            type="text"
            placeholder="Identifiant"
            className="w-full h-12 bg-transparent border border-white rounded-full text-base text-white px-5"
          />
        </div>
        <div className="relative w-full my-6">
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full h-12 bg-transparent border border-white rounded-full text-base text-white px-5"
          />
        </div>
        <button
          className="w-full h-11 bg-light-white border-none outline-none rounded-full shadow-sm cursor-pointer text-base text-gray-800 font-semibold mb-3.5"
          onClick={handleSubmit}
        >
          Connexion
        </button>
        <div className="flex justify-between text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="accent-white mr-1" />
            Se souvenir de moi
          </label>
          <a href="#" className="text-white no-underline hover:underline">
            Mot de passe oublié ?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page;
