'use client';

import { PhoneIcon } from '@heroicons/react/24/solid';

const PHONE = '+917036335500';
const WHATSAPP = '917036335500';

/**
 * Floating quick-contact buttons (call + WhatsApp) fixed to the
 * bottom-right of every public page.
 */
export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/30 transition-transform hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />
        <svg viewBox="0 0 32 32" className="relative h-7 w-7 fill-white" aria-hidden="true">
          <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.59 4.463 1.71 6.404L3.2 28.8l6.57-1.723a12.74 12.74 0 006.234 1.588h.005c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.805-12.8zm0 23.36h-.004a10.53 10.53 0 01-5.367-1.47l-.385-.229-3.898 1.022 1.04-3.8-.25-.39a10.53 10.53 0 01-1.612-5.623c0-5.83 4.744-10.574 10.578-10.574 2.825 0 5.48 1.101 7.477 3.1a10.5 10.5 0 013.097 7.48c0 5.83-4.744 10.574-10.574 10.574zm5.8-7.92c-.318-.16-1.88-.928-2.172-1.034-.291-.106-.503-.16-.715.16-.212.318-.82 1.033-1.006 1.245-.185.212-.371.239-.689.08-.318-.16-1.343-.495-2.558-1.578-.945-.843-1.583-1.884-1.769-2.202-.185-.318-.02-.49.14-.649.143-.142.318-.371.477-.557.16-.185.212-.318.318-.53.106-.212.053-.398-.027-.557-.08-.16-.715-1.724-.98-2.36-.258-.62-.52-.535-.715-.545l-.61-.011c-.212 0-.556.08-.847.398-.291.318-1.112 1.087-1.112 2.651s1.139 3.075 1.298 3.287c.16.212 2.242 3.423 5.43 4.8.759.328 1.351.524 1.813.67.762.242 1.455.208 2.003.126.611-.091 1.88-.768 2.146-1.51.265-.742.265-1.378.185-1.51-.079-.133-.291-.213-.609-.372z" />
        </svg>
        <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-black/80 px-3 py-1.5 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
          Chat on WhatsApp
        </span>
      </a>

      {/* Call */}
      <a
        href={`tel:${PHONE}`}
        aria-label="Call us"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 shadow-lg shadow-black/30 transition-transform hover:scale-110"
      >
        <PhoneIcon className="h-6 w-6 text-[#1a0f2e]" />
        <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-black/80 px-3 py-1.5 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
          Call {PHONE}
        </span>
      </a>
    </div>
  );
}
