# API

### Como executar o projeto:

- primeiramente preencher as variaveis de ambiente do .env.example
- Após isso executar o comando: `Docker compose up -d`
- O banco de dados postgres esta funcionando e o pgadmin também
- Rodar o caomando: `npm install`
- Rodar o caomando: `npm run build`
- Rodar o caomando: `npm run migration:run`

  - caso a migration não funcione, execute o comando: `docker ps`
  - copie o id do container do postgres
  - após isso execute o comando: `docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <id-container>`
  - copie o ip retonado e substitua o host no .env
  - exemplo de ip: 172.19.0.2

- Com as migrations executadas, podemos iniciar o projeto `npm start`
- Acesse a rota: `http://localhost:3001/api/docs`
    - Rota do swagger com toda a documentação da api
    - Existe um arquivo do insomnia na raiz do projeto que pode ser importado no postman

