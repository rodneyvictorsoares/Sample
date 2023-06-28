const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();

// Configurar o CORS
app.use(cors());


// Dados de exemplo
let books = [
  { id: 1, title: 'Livro 1', author: 'Autor 1' },
  { id: 2, title: 'Livro 2', author: 'Autor 2' },
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Rota para obter todos os livros
  if (method === 'GET' && url === '/books') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(books));
  }
  // Rota para obter um livro específico pelo ID
  else if (method === 'GET' && url.startsWith('/books/')) {
    const id = parseInt(url.split('/')[2]);
    const book = books.find((book) => book.id === id);

    if (book) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(book));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Livro não encontrado' }));
    }
  }
  // Rota para adicionar um novo livro
  else if (method === 'POST' && url === '/books') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { title, author } = JSON.parse(body);
      const id = books.length + 1;
      const newBook = { id, title, author };
      books.push(newBook);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newBook));
    });
  }
  // Rota para atualizar um livro existente
  else if (method === 'PUT' && url.startsWith('/books/')) {
    const id = parseInt(url.split('/')[2]);

    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { title, author } = JSON.parse(body);
      const book = books.find((book) => book.id === id);

      if (book) {
        book.title = title;
        book.author = author;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(book));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Livro não encontrado' }));
      }
    });
  }
  // Rota para excluir um livro
  else if (method === 'DELETE' && url.startsWith('/books/')) {
    const id = parseInt(url.split('/')[2]);
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
      const deletedBook = books.splice(index, 1);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(deletedBook[0]));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Livro não encontrado' }));
    }
  }
  // Rota não encontrada
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  }
});

// Iniciando o servidor na porta 3000
server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
