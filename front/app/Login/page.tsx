/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react'
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Page = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null)

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
    e.preventDefault();
        try {
          const url = "https://back-jf-eseo.tomherault.fr/connexion";
          const body = JSON.stringify({ email, password });
          console.log(body);
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: body,
          });
          console.log(response);
          if (!response.ok) {
            const errorMessage = await response.text();
            setErrorMessage(errorMessage);
            throw new Error(errorMessage);
          } else {
            const contentType = response.headers.get("content-type");
            console.log(contentType)
            //const data = await response.json();
            window.location.href = "/";
          }
        } catch (error) {
          console.error("Erreur lors de la connexion :", error);
          setErrorMessage("Identifiants incorrects. Veuillez réessayer.");
        }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-[url('/images/eseo_exterieur.png')]">
      <div
        className="w-[420px] bg-transparent border-0 md:border-2 border-white/20 backdrop-blur-[20px] shadow-lg text-white rounded-lg p-8"
        style={{
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="flex justify-center mt-5 mb-10">
          <Image
            src="/images/logo_eseo/ESEO-logo-couleur-positif.png"
            alt="Logo"
            width={300}
            height={200}
            className="object-contain object-center"
          />
        </div>
        <div className="relative w-full my-6">
          <Input 
            type="text"
            placeholder="Identifiant"
            ref={inputRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative w-full my-6">
        <Input 
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>
        <Button 
          className="w-full h-11 bg-white border-none outline-none rounded-full shadow-sm cursor-pointer text-base text-secondary_blue font-semibold mb-3.5 hover:bg-secondary_blue hover:text-white transition-transform duration-300 transform hover:scale-105"
          onClick={handleSubmit}
        >
          Connexion
        </Button>
        <div className="flex justify-center underline text-sm">
          <a href="#" className="text-white no-underline hover:text-primary_blue hover:underline decoration-primary_blue">
            Mot de passe oublié ?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page;
