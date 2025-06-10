import Document, { Html, Head, Main, NextScript } from 'next/document';

     class MyDocument extends Document {
       render() {
         return (
           <Html>
             <Head>
               <link rel="stylesheet" href="/reveal.js/dist/reveal.css" />
               <link rel="stylesheet" href="/reveal.js/dist/theme/black.css" />
             </Head>
             <body>
               <Main />
               <NextScript />
             </body>
           </Html>
         );
       }
     }

     export default MyDocument;