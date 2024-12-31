// HTTP Server creation using Fastify Framework

import { fastify } from 'fastify'
import fastifyFormbody from '@fastify/formbody'
import fastifyStatic from '@fastify/static'
import { DatabaseNeon } from './db-server.js'
import path from 'path'
import open from 'open'

const server = fastify()
const db = new DatabaseNeon()

/* route creation usgin HTTP methods:
  - GET (used to receive information)
  - POST (used for creation),
  - PUT (used for modification),
  - DELETE (used for deletion),
  - PATCH (modify a specific information of a resource and not all its data)
*/

server.register(fastifyFormbody)

server.register(fastifyStatic, {
  root: path.join(process.cwd(), 'public'),
  prefix: '/public/',
})


server.get('/new-video', async (request, reply) => {
  return reply.sendFile('cadastrar-video.html')
})

server.get('/delete-video', async (request, reply) => {
  return reply.sendFile('deletar-video.html')
})


server.get('/videos', async (request) => {
  
  // implementing 'query parameter'
  const search = request.query.search
  const videos = await db.list(search)

  console.log(search)

  return videos

})


server.post('/videos', async (request, reply) => {
  const { title, description, duration } = request.body

  try {
    // Chama a função db.create() para salvar os dados no banco
    await db.create({
      title,
      description,
      duration,
    })
    
    // Respondendo ao cliente com sucesso
    return reply.status(201).send('Vídeo registrado com sucesso!')
  } catch (err) {
    // Em caso de erro ao salvar no banco de dados
    console.error(err)
    return reply.status(500).send('Erro ao registrar o vídeo!')
  }
})

server.post('/videos/delete', async (request, reply) => {
  // Extrai o ID do vídeo do corpo da requisição
  const { id } = request.body;
  
  if (!id) {
    return reply.status(400).send({ error: 'ID do vídeo é necessário!' });
  }

  try {
    // Chama a função de deleção do banco de dados
    await db.delete(id);
    return reply.status(200).send({ message: 'Vídeo deletado com sucesso!' });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Erro ao deletar vídeo!' });
  }
});


server.listen({
  port: 3334,
})

server.listen({
  port: 3334,
  host: 'localhost', // Você pode definir o host também (opcional)
}, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  // Abrir a URL do formulário no navegador
  open('http://localhost:3334/new-video')

  console.log(`Server listening at ${address}`) 
})
