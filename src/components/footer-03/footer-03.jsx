"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";

import Image from "next/image";

import React from "react";
import ReactDOM from "react-dom";

import {
  Link,
  DirectLink,
  Element,
  Events,
  animateScroll,
  scrollSpy,
  scroller
} from "react-scroll";

const footerSections = [
  {
    title: "Seções",
    links: [
      {
        title: "O Que Fazemos",
        href: "o-que-fazemos",
      },
      {
        title: "Quem Somos",
        href: "quem-somos",
      },
      {
        title: "Nossos Produtos",
        href: "setores-produtos",
      },
      {
        title: "Parcerias",
        href: "parcerias",
      },
      {
        title: "Contato",
        href: "contato",
      },
    ],
  },
];

const Footer03Page = () => {

  const durationFn = function(deltaTop) {
      return deltaTop;
    };
    
    const  scrollToTop = () => {
      animateScroll.scrollToTop()
    }
    const scrollTo = (offset) => {
      scroller.scrollTo("scroll-to-element", {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: offset
      });
    }
    const scrollToWithContainer= () =>{
      let goToContainer = new Promise((resolve, reject) => {
        Events.scrollEvent.register("end", () => {
          resolve(true);
          Events.scrollEvent.remove("end");
        });
    
        scroller.scrollTo("scroll-container", {
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart"
        });
      });
    
      goToContainer.then(() =>
        scroller.scrollTo("scroll-container-second-element", {
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart",
          containerId: "scroll-container",
          offset: 50
        })
      );
    }
  
  return (
    <div className="flex flex-col">
      <footer className="bg-accent text-white">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div className="py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="col-span-full xl:col-span-2">
              <Image
                src="/logotipo-branca.png"
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
                      to={href} spy={true} smooth={true} offset={-70} duration={500} className="hover:text-primary cursor-pointer"
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
             
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer03Page;
