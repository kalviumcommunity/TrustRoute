import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import redis from '@/lib/redis'

export async function GET() {
    const healthStatus: any = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
            backend: 'ok',
            database: 'down',
            redis: 'down',
        },
    }

    try {
        // Check Database
        await prisma.$queryRaw`SELECT 1`
        healthStatus.services.database = 'ok'
    } catch (error) {
        healthStatus.services.database = 'error'
        healthStatus.status = 'error'
        console.error('Database health check failed:', error)
    }

    try {
        // Check Redis
        await redis.ping()
        healthStatus.services.redis = 'ok'
    } catch (error) {
        healthStatus.services.redis = 'error'
        healthStatus.status = 'error'
        console.error('Redis health check failed:', error)
    }

    return NextResponse.json(healthStatus, {
        status: healthStatus.status === 'ok' ? 200 : 500,
    })
}
