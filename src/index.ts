import 'dotenv/config'
import { buildServer } from './server'

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000
const HOST = process.env.HOST || '0.0.0.0'

async function start() {
    const server = buildServer()

    try {
        await server.listen({ port: PORT, host: HOST })
        console.log(`Server is running on http://${HOST}:${PORT}`)
        console.log(`API documentation available at http://${HOST}:${PORT}/docs`)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()
