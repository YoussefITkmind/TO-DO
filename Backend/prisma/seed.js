import "dotenv/config";
import { prisma } from "../src/config/db.js";





const tasks = [
    {
        title: "first task",
        status: "completed",
        priority: "high",
        category: "work",
        description: "mashy",
        dueDate: new Date('2026-08-15T12:00:00Z')
    }, {
        title: "second task",
        status: "completed",
        
        priority: "high",
        category: "work",
        description: "mashy",
        dueDate: new Date('2026-08-15T12:00:00Z')
    }, {
        title: "third task",
        status: "pending",
        priority: "high",
        category: "work",
        description: "mashy",
        dueDate: new Date('2026-08-15T12:00:00Z')
    }, {
        title: "forth task",
        status: "pending",
        priority: "high",
        category: "work",
        description: "mashy",
        dueDate: new Date('2026-08-15T12:00:00Z')
    }, {
        title: "fifth task",
        status: "pending",
        priority: "high",
        category: "work",
        description: "mashy",
        dueDate: new Date('2026-08-15T12:00:00Z')
    }, {
        title: "six task",
        status: "pending",
        priority: "high",
        category: "work",
        description: "mashy",
        dueDate: new Date('2026-08-15T12:00:00Z')
    }, {
        title: "sevens task",
        status: "pending",
        priority: "high",
        category: "work",
        description: "mashy",
        dueDate: new Date('2026-08-15T12:00:00Z')
    }, {
        title: "tens task",
        status: "pending",
        priority: "high",
        category: "work",
        description: "mashy",
        dueDate: new Date('2026-08-15T12:00:00Z')
    }

]

const main = async () => {

    for (const task of tasks) {
        await prisma.task.create({
            data: task,
        })

    }
}


main().catch((err => {
    console.error(err)
    process.exit(1)
})).finally(async () => {
    await prisma.$disconnect()
})