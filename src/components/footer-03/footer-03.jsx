import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";

import Image from "next/image";

const footerSections = [
  {
    title: "Seções",
    links: [
      {
        title: "Quem Somos",
        href: "#quem-somos",
      },
      {
        title: "O Que Fazemos",
        href: "#o-que-fazemos",
      },
      {
        title: "Nossos Produtos",
        href: "#setores-produtos",
      },
      {
        title: "Parcerias",
        href: "#parcerias",
      },
      {
        title: "Contato",
        href: "#contato",
      },
    ],
  },
];

const Footer03Page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="grow" />
      <footer className="bg-footer text-white">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div className="py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="col-span-full xl:col-span-2">
              <Image
                src="/logotipo-branca.svg"
                alt="Logotipo Quimex"
                width={200}
                height={80}
              />

              <p className="mt-4">
                Inovação, Qualidade e Parceria, Liderando o futuro da química.
              </p>
            </div>

            {footerSections.map(({ title, links }) => (
              <div key={title}>
                <h6 className="font-bold">{title}</h6>
                <ul className="mt-6 space-y-4">
                  {links.map(({ title, href }) => (
                    <li key={title} className="">
                      <Link
                        href={href}
                        className="hover:text-primary"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="/" target="_blank">
                Quimex
              </Link>
              .Todos os direitos reservados.
            </span>

            <div className="text-primary flex items-center gap-5">
              <Link href="#" target="_blank">
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <DribbbleIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <TwitchIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <GithubIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer03Page;
