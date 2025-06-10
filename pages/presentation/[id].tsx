import { useRouter } from 'next/router';
     import { useEffect, useRef, useState } from 'react';
     import Head from 'next/head';

     const blobUrls = {
       test1: 'https://7vaivv5bvihb2dv0.public.blob.vercel-storage.com/reveal_presentation-bGZ8LqmJxxZfQCUaWzwECdn2QKVRLI.html',
     };

     export default function PresentationPage() {
       const router = useRouter();
       const { id } = router.query;
       const revealRef = useRef(null);
       const [html, setHtml] = useState('');

       useEffect(() => {
         if (!id) return;
         const url = blobUrls[id];
         if (!url) {
           setHtml('<p>Presentation not found</p>');
           return;
         }
         fetch(url)
           .then((res) => res.text())
           .then((data) => setHtml(data))
           .catch((err) => {
             console.error('Error fetching HTML:', err);
             setHtml('<p>Error loading presentation</p>');
           });
       }, [id]);

       useEffect(() => {
         if (typeof window !== 'undefined' && revealRef.current && html) {
           import('reveal.js').then((Reveal) => {
             const reveal = Reveal.default;
             reveal.initialize({
               autoSlide: 5000,
               controls: true,
               progress: true,
               transition: 'slide',
             });
             reveal.on('slidechanged', (event) => {
               const slide = event.currentSlide;
               const text = Array.from(slide.querySelectorAll('h1, h2, p'))
                 .map((el) => el.textContent)
                 .join(' ');
               if (window.speechSynthesis) {
                 window.speechSynthesis.cancel();
                 const utterance = new SpeechSynthesisUtterance(text);
                 window.speechSynthesis.speak(utterance);
               }
             });
             document.addEventListener('keydown', (e) => {
               if (e.code === 'Space') {
                 e.preventDefault();
                 reveal.isAutoSliding() ? reveal.pause() : reveal.resume();
               }
             });
             return () => document.removeEventListener('keydown', () => {});
           });
         }
       }, [html]);

       return (
         <>
           <Head>
             <title>Presentation</title>
           </Head>
           <div
             ref={revealRef}
             className="reveal"
             dangerouslySetInnerHTML={{ __html: html }}
             style={{ height: '100vh' }}
           />
         </>
       );
     }