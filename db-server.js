import { randomUUID } from "node:crypto"
import { sql } from "./db.js"

export class DatabaseNeon {

  async list(search) { // 'async' is being used beacause of the necessity of utilizing the 'await' command
    let videos

    if (search) {
      videos = await sql`select * from videos where title ilike ${'%' + search + '%'}` // 'await' tells the code to wait untill the 'sql' instruction completes execution.
    } else {
      videos = await sql`select * from videos`
    }

    return videos
  }

  async create(video) {
    const videoId = randomUUID()
    const { title, description, duration } = video

    await sql`insert into videos (id, title, description, duration) VALUES (${videoId}, ${title}, ${description}, ${duration})`
  }

  async update(id, video) {
    const { title, description, duration } = video
    await sql`update videos set title = ${title}, description = ${description}, duration = ${duration} WHERE id = ${id}`
  }

  async delete(id) {
    await sql`delete from videos where id = ${id}`
  }
}