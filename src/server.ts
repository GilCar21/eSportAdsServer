import express from "express";
import cors from "cors"

import { PrismaClient } from "@prisma/client";
import { convertHourToMinutes } from "./utils/convert-hour-to-minutes";
import { convertMinutesToHours } from "./utils/convert-minutes-to-hours";

const app = express();
app.use(express.json())
app.use(cors())

const prisma = new PrismaClient({
    log: ['query']
})

app.get('/games', async (req, res) =>{
    const games = await prisma.game.findMany({
        include:{
            _count:{
                select:{
                    ads: true,
                }
            }
        }
    })

    return res.json(games);
})

app.post('/games/:id/ads', async (req, res) =>{
    const gameId = req.params.id;
    const {
        name, 
        weekDays, 
        useVoiceChannel, 
        yearsPlaying, 
        hourStart, 
        hourEnd,
        discord,
    } = req.body
    const ad = await prisma.ad.create({
        data:{
            gameId,
            name,
            weekDays: weekDays.join(','),
            useVoiceChannel,
            yearsPlaying,
            hourStart: convertHourToMinutes(hourStart),
            hourEnd: convertHourToMinutes(hourEnd),
            discord,
        }
    })

    return res.status(201).json(ad)
})

app.get('/games/:id/ads', async (req, res) =>{
    const gameId = req.params.id

    const ads = await prisma.ad.findMany({
        select:{
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where:{
            gameId,
        },
        orderBy:{
            createAt: 'desc',
        }
    })
    return res.json(ads.map(ad =>{
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToHours(ad.hourStart),
            hourEnd: convertMinutesToHours(ad.hourEnd),
        }
    }))
})

app.get('/ads/:id/discord', async (req, res) =>{
    const adId = req.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select:{
            discord: true,
        },
        where:{
            id: adId,
        }
    })
    return res.json({
        discord: ad.discord,
    })
})

app.listen(3001)