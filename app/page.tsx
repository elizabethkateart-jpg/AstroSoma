'use client';

// LANDING DE ASTROSOMA — compuesta desde el KIT CANÓNICO (components/landing/).
// Copy trazado a FICHA-AVATAR.md, ver docs/copy/landing.md. Tokens desde FICHA-ARTE.md
// (components/landing/tokens.css). Modelo onboarding-first (02C): CTA → /onboarding.

import { HeartCrack, BellOff, Moon, Anchor } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { MensajeContraste } from '@/components/landing/MensajeContraste';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile, VolverArriba } from '@/components/landing/ui';

const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Descubrir mi zona de tensión gratis';

export default function LandingAstroSoma() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* 1. HERO */}
      <Hero
        appName="AstroSoma"
        loginHref="/entrar"
        h1Marked="Ese nudo en tu pecho [acento]no es casualidad[/acento]"
        subtitleMarked="El Escaneo Somático te muestra dónde acumulas el dolor y cómo soltarlo en minutos"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>Prueba gratis 7 días · cancela cuando quieras</span>}
        visual={
          <div className="respira-marco relative">
            <img
              src="/mockups/hoy.png"
              alt="Vista previa de diseño de la pantalla principal de AstroSoma"
              className="h-full w-full object-cover"
            />
            <span className="absolute left-3 top-3 rounded-full bg-[color-mix(in_oklab,var(--bg)_70%,transparent)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">
              Vista previa de diseño
            </span>
          </div>
        }
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { icon: HeartCrack, textoMarked: '¿Sientes un nudo en el pecho o la garganta que no baja?' },
          { icon: BellOff, textoMarked: '¿Las apps de astrología te llenan de ansiedad en vez de calma?' },
          { icon: Moon, textoMarked: '¿Te despiertas de madrugada con ganas de escribirle a tu ex?' },
          { icon: Anchor, textoMarked: '¿Sientes miedo de quedarte estancada en este dolor para siempre?' },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        frases={[
          'Cada noche que pasa sin liberar esa tensión, [b]se acumula más estrés en tu cuerpo[/b].',
          'En un año, ese nudo sin resolver son [acento]365 noches más dándole vueltas y mensajes que no quisiste mandar[/acento].',
          'Otra app de horóscopos no lo arregla: [b]más miedo no es alivio[/b].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Opresión en el pecho y ganas de revisar sus redes a las 3 AM.',
          labelFuturo: 'En 6 meses, si nada cambia',
          futuro: 'El mismo nudo — solo que ahora ya perdiste 6 meses de paz.',
        }}
      />

      {/* 4. SOLUCIÓN */}
      <Solucion
        tituloMarked="Tu alivio en 3 minutos, [acento]cada noche[/acento]"
        mecanismo="el Escaneo Somático"
        bigIdeaMarked="No te falta fuerza de voluntad: te falta saber dónde vive el dolor. [b]El Escaneo Somático te lo muestra en tu cuerpo[/b]."
        pasos={[
          { titulo: 'Escaneas', detalle: 'Un tránsito de tu carta natal revela tu zona de tensión de hoy.' },
          { titulo: 'Liberas', detalle: 'Sigues un ejercicio guiado de respiración de exactamente 3 minutos.' },
          { titulo: 'Avanzas', detalle: 'Ves tu progreso día a día en tu Programa de Ruptura.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Un nudo en el pecho y una notificación que te asusta más.',
          labelDespues: 'Después',
          despues: 'Sabes exactamente dónde soltarlo y ya lo hiciste en 3 minutos.',
        }}
      />

      {/* 5. LA APP POR DENTRO */}
      <AppPorDentro
        tituloMarked="Tu ritual de cada noche, [acento]ya decidido[/acento]"
        frames={[
          { label: 'Cómo te pregunta al empezar', nombrePantalla: 'Bienvenida', src: '/mockups/onboarding.png', alt: 'Vista previa de diseño: pregunta de bienvenida del onboarding' },
          { label: 'Tu ejercicio de 3 minutos', nombrePantalla: 'Mecanismo', src: '/mockups/mecanismo.png', alt: 'Vista previa de diseño: ejercicio de respiración en curso' },
          { label: 'Tu Programa de Ruptura, día a día', nombrePantalla: 'Duelo', src: '/mockups/duelo.png', alt: 'Vista previa de diseño: programa de ruptura de 30 días' },
          { label: 'Así eliges tu plan', nombrePantalla: 'Plan', src: '/mockups/paywall.png', alt: 'Vista previa de diseño: pantalla de planes y precio' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* AÑADIDO DEL PROYECTO — demo de tono pedida por FICHA-AVATAR.md, entre la prueba
          visual y el precio (ver ESTADO.md) */}
      <MensajeContraste />

      {/* 6. OFERTA */}
      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]$0.14 al día[/acento]"
        trialDias={7}
        stack={{
          lineas: [
            { resultado: 'AstroSoma Pro — Escaneo Somático ilimitado (12 meses)', valor: '$107' },
            { resultado: 'Programa de Ruptura guiado de 30 días', valor: '$29' },
            { resultado: 'Diario privado cifrado', valor: '$19' },
          ],
          totalTachado: '$155',
        }}
        anual={{
          nombre: 'Anual',
          badge: 'MÁS POPULAR',
          precioMes: '$4.17',
          totalAnual: 'Se cobra $49.99/año',
          ahorro: 'Ahorra 54%',
          descomposicionDia: 'menos de $0.14 al día',
          ctaLabel: CTA_LABEL,
          ctaHref: CTA_HREF,
          features: [
            'Escaneo somático ilimitado cada día',
            'Programa de Ruptura guiado de 30 días',
            'Ejercicios de liberación de 3 minutos',
            'Diario privado cifrado, solo tuyo',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$8.99',
          ctaLabel: CTA_LABEL,
          ctaHref: CTA_HREF,
          features: [
            'Escaneo somático ilimitado cada día',
            'Programa de Ruptura guiado de 30 días',
            'Ejercicios de liberación de 3 minutos',
            'Cancelas cuando quieras',
          ],
        }}
      />

      {/* 7. GARANTÍA */}
      <Garantia
        nombre="la Garantía del Primer Alivio"
        condicionMarked="7 días de prueba gratis y, si después de tu primer cobro el Escaneo Somático no te ayuda a sentir [b]alivio físico real[/b], 15 días más para pedir tu reembolso completo. Sin preguntas."
        pisoLegal="Respaldada por la política de reembolsos de Hotmart"
      />

      {/* 8. FAQ */}
      <Faq
        items={[
          {
            pregunta: '¿Esto reemplaza terapia o tratamiento médico?',
            respuestaMarked:
              'No. AstroSoma es una herramienta de autocuidado y bienestar somático, [b]no un tratamiento médico ni terapia[/b]. Si sientes una crisis, busca ayuda profesional.',
          },
          {
            pregunta: '¿Las notificaciones me van a asustar como otras apps?',
            respuestaMarked:
              'Nunca. AstroSoma no manda notificaciones fatalistas — [b]solo tu tránsito del día y tu ejercicio de 3 minutos[/b], sin mensajes de pánico.',
          },
          {
            pregunta: '¿Mis diarios y pensamientos quedan guardados en algún lado?',
            respuestaMarked:
              'Tu diario es privado y cifrado. Nadie más lo lee, y [b]nunca se comparte ni se vende[/b].',
          },
          {
            pregunta: '¿Cuánto tardo en ver resultados?',
            respuestaMarked:
              'Tu primer escaneo toma 1 minuto y tu primer ejercicio de liberación, 3. La mayoría siente alivio [b]desde la primera sesión[/b].',
          },
          {
            pregunta: '¿Qué pasa si no me sirve?',
            respuestaMarked:
              'Tienes 7 días de prueba gratis y, si no te sirve, 15 días más desde tu primer cobro para pedir el reembolso completo: [b]un correo y te devolvemos todo[/b].',
          },
        ]}
      />

      {/* 9. CTA FINAL */}
      <CtaFinal
        h2Marked="Tu alivio te espera [acento]esta noche[/acento]"
        futurePacingMarked="Esta noche haces tu primer escaneo, sientes dónde vive el dolor, y en minutos empiezas a soltarlo."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="7 días gratis + 15 días de garantía"
        psMarked="PS: AstroSoma traduce tu carta natal en el Escaneo Somático — 3 minutos que te muestran dónde vive tu dolor y cómo soltarlo. Hoy entras con 7 días gratis."
      />

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="AstroSoma"
        soporteEmail="soporte@astrosoma.app"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos y Condiciones', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Aviso de IA', href: '/aviso-ia' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
      <VolverArriba />
    </div>
  );
}
