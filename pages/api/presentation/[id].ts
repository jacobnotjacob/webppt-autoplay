import { NextApiRequest, NextApiResponse } from 'next';
     import { PrismaClient } from '@prisma/client';

     const prisma = new PrismaClient();

     export default async function handler(req: NextApiRequest, res: NextApiResponse) {
       if (req.method !== 'GET') {
         return res.status(405).json({ error: 'Method not allowed' });
       }

       const { id } = req.query;

       try {
         const presentation = await prisma.presentation.findUnique({
           where: { id: id as string },
           select: { id: true, title: true, html: true },
         });

         if (!presentation) {
           return res.status(404).json({ error: 'Presentation not found' });
         }

         res.status(200).json(presentation);
       } catch (error) {
         console.error('Error fetching presentation:', error);
         res.status(500).json({ error: 'Server error' });
       }
     }