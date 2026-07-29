
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development"
    ? ["query", "error","warn"]
    :["error"]
})

const connectDB =async =>{
    try{
        await prisma.$connect()
        console.log('Db connected via prisma')
    }catch (error){
        console.error(`Database connection error: ${error.message}`)
        process.exit(1)
    }
}
const disconnectDB =async =>{
        await prisma.$disconnect()
        console.log('Db disconnected via prisma')
  
}

export {prisma,connectDB,disconnectDB}