"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import InfoHover from "@/components/molecules/InfoHover";

// --- Components ---

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      {/* Background Parallax */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1535581652167-3d6b98c364c6?q=80&w=2400&auto=format&fit=crop"
          alt="Valo Hero"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-[#0a0a0a]"></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="font-sans text-xs md:text-sm font-bold tracking-[0.5em] text-gray-400 mb-6 block">
            EST. 2026
          </span>
          <h1 className="font-serif text-7xl md:text-[10rem] leading-[0.8] font-medium tracking-tight mb-8 mix-blend-overlay">
            The Soul <br /> <span className="italic font-light text-gray-300">in Resin</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-4"
        >
          <span className="font-sans text-[10px] tracking-[0.2em] text-gray-500">SCROLL TO DISCOVER</span>
          <ChevronDown className="w-4 h-4 text-gray-500 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

function Philosophy() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20%" });

  return (
    <section ref={ref} className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center px-8 py-24 md:py-0 relative z-20">
      <div className="max-w-4xl text-center">
        <motion.p 
          className="font-serif text-3xl md:text-5xl leading-relaxed md:leading-normal text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-white">We do not manufacture dolls.</span> We orchestrate light, shadow, and resin to create <span className="italic text-valo-gold">vessels for the soul</span>. Every <InfoHover term="joint" definition="A ball-and-socket engineering marvel allowing 360° fluidity." /> is an engineering marvel; every contour, a poem.
        </motion.p>
        
        <motion.div 
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="h-24 w-px bg-linear-to-b from-valo-gold to-transparent"></div>
        </motion.div>
      </div>
    </section>
  );
}

function TechnicalSpecs() {
  const specs = [
    { title: "UV-Resistant Resin", value: "Grade A+", desc: "Yellowing resistance up to 5 years." },
    { title: "Joint Fluidity", value: "Double", desc: "S-shaped knee joints for natural kneeling." },
    { title: "Surface Tension", value: "Matte", desc: "Hand-sanded 3000-grit velvet finish." },
    { title: "String Tension", value: "4mm", desc: "German elastic cord for perfect posing." },
  ];

  return (
    <section className="w-full bg-[#0e0e0c] py-32 px-12 border-t border-white/5">
       <div className="max-w-6xl mx-auto">
         <div className="flex flex-col md:flex-row justify-between items-end mb-16">
           <h2 className="font-serif text-5xl text-white">The Craft</h2>
           <span className="font-mono text-xs text-valo-gold tracking-widest mt-4 md:mt-0">ENGINEERING SPECIFICATIONS</span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {specs.map((spec, index) => (
            <div key={index} className="group p-6 border border-white/5 hover:border-valo-gold/30 transition-colors duration-500 bg-white/2">
              <h3 className="font-sans text-xs text-gray-500 tracking-widest mb-4">{spec.title.toUpperCase()}</h3>
               <p className="font-serif text-3xl text-white mb-2 group-hover:text-valo-gold transition-colors">{spec.value}</p>
               <p className="font-sans text-xs text-gray-400 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{spec.desc}</p>
             </div>
           ))}
         </div>
       </div>
    </section>
  );
}

function HorizontalGallery() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66%"]); // Move 2/3 of width

  const items = [
    { 
      id: "01", 
      title: "The Gaze", 
      img: "https://images.unsplash.com/photo-1629213014154-d88806295556?q=80&w=1200&auto=format&fit=crop",
      desc: "Hand-painted irises with depth." 
    },
    { 
      id: "02", 
      title: "The Touch", 
      img: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=1200&auto=format&fit=crop",
      desc: "Velvet-finish resin casting." 
    },
    { 
      id: "03", 
      title: "The Form", 
      img: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1200&auto=format&fit=crop",
      desc: "Anatomically correct joint systems." 
    },
  ];

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#0a0a0a]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-20 px-20 md:px-40">
          {items.map((item) => (
            <div key={item.id} className="relative w-[80vw] md:w-[60vw] h-[70vh] shrink-0 group">
              <div className="w-full h-full relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ease-out">
                <Image 
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="absolute -bottom-12 left-0">
                 <span className="font-mono text-xs text-valo-gold mb-2 block">{item.id}</span>
                 <h3 className="font-serif text-4xl text-white italic">{item.title}</h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function LabTeaser() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden group">
      {/* Background Video Placeholder */}
      <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-1000">
         <Image 
           src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2400&auto=format&fit=crop"
           alt="Lab Background"
           fill
           className="object-cover blur-xs scale-105 group-hover:scale-100 transition-transform duration-[2s]"
         />
      </div>
      
      <div className="relative z-10 text-center">
        <h2 className="font-serif text-6xl md:text-8xl text-white mb-8 tracking-tight">
          Light Lab <span className="text-valo-gold text-2xl align-top font-mono">BETA</span>
        </h2>
        <p className="font-sans text-gray-400 max-w-lg mx-auto mb-12 leading-loose">
          Experience your creation under 4,000 lighting conditions. <br/>
          From candlelight to studio flash.
        </p>
        
        <Link href="/lab">
          <button className="relative px-12 py-4 bg-transparent border border-white/20 text-white font-sans text-xs font-bold tracking-[0.2em] overflow-hidden group/btn hover:border-valo-gold transition-colors">
            <span className="relative z-10 group-hover/btn:text-black transition-colors">ENTER SIMULATION</span>
            <div className="absolute inset-0 bg-valo-gold transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
          </button>
        </Link>
      </div>
    </section>
  )
}



export default function Home() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Hero />
      <Philosophy />
      <TechnicalSpecs />
      <HorizontalGallery />
      <LabTeaser />
      <Footer />
    </main>
  );
}
