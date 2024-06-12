# Gerenciamento de Pagáveis.

Esta aplicação é uma API desenvolvida com NodeJS, utilizando Typescript e o framework Nest, ela tem por objetivo implementar um sistema de cadastro de recebíveis para clientes de algum banco, com autenticação de seus usuários. Além dos elementos já citados ela também utiliza de bancos de dados SQLite, gerenciado pela aplicação com a utilização de um ORM chamado Prisma, assim como a utilização de Redis, este gerenciamento de cadastros com sucesso.

Como padrões arquiteturais foram adotadas estratégias como DDD, Clean Architecture e SOLID. O caminho lógico de cada requisição é chegar ao seu Endpoint, ser redirecionado para o Controller que fara a verificação dos requisitos solicitações para a executação da ação solicitada e, se os requisitos foram supridos, então redicionar para o Service dentro do domínio da aplicação que fara a execução da atividade e o retorno de dados quando for necessário.

## Instruções para inicialização:

Toda a aplicação é desenvolvida em containers, e esses são administrados com Docker compose, então para iniciar corretamente a aplicação é necessário que todos os containers estejam em operação.

### Como iniciar o back-end da aplicação:

- Com um terminal aberto na página raiz do projeto, execute o comando "docker compose up -d" e espere os containers ficarem disponíveis.
- Entre na pasta "back-end" e instale as dependencias com o comando "npm install".
- Após os primeiros passos, entre no container da aplicação, com o comando "docker compose exec aprove-me-back sh" e configure o banco de dados com o comando "npx prisma migrate dev".
- Com os dois passos anteriores cumpridos, poderemos utilizar a aplicação. Se quisermos executar os testes, podemos utilizar o comando "npm run test-e2e" ou "npm run test-unit", dependendo do tipo de testes que você quer executar.
- Se quiser iniciar a aplicação em produção execute os comandos "npm run build" e em seguida o comando "npm run start".
- Se quiser iniciar a aplicação em desenvolvimento execute o comando "npm run start:dev".
- A aplicação é executada na porta 3333 e na porta 3000, assim como o Redis na porta 6379 e o RabbitMQ na porta 5672 então tome cuidado para não possuir outras ferramentas em execução nestas portas.

### Como iniciar o front-end da aplicação:

- Com um terminal aberto na página raiz do projeto, execute o comando "docker compose up -d" e espere os containers ficarem disponíveis.
- Entre na pasta "front-end" e instale as dependencias com o comando "npm install".
- Após o primeiro passo, entre no container da aplicação, com o comando "docker compose exec aprove-me-front sh".
- Se quiser iniciar a aplicação em produção execute os comandos "npm run build" e em seguida o comando "npm run start".
- Se quiser iniciar a aplicação em desenvolvimento execute o comando "npm run dev".
- A aplicação é executada na porta 3333 e na porta 3000, assim como o Redis na porta 6379 e o RabbitMQ na porta 5672 então tome cuidado para não possuir outras ferramentas em execução nestas portas.

## Documentação de Endpoints - Backend

A documentação de endpoints foi feita utilizando a ferramente Swagger e pode ser encontrada ao iniciar a aplicação com o link: http://localhost:3333/docs

## Variáveis de Ambiente

Todas as variáveis de ambiente estão descritas no arquivo docker-compose.yaml e os valores disponíveis no repositório são, somente, valores randômicos e devem ser substituidos antes da utilização.

## Testes

Os testes são escritos utilizando o framework Jest, ele é utilizado em todos os tipos de teste e facilita o processo de gerenciamento dos ambientes além da própria execução, e a biblioteca Supertest, utilizada para criar uma instancia da aplicação e tornar possível as requisições nos testes E2E.

Os testes unitários estão presentes, principalmente, dentro do domínio da aplicação, na parte de Services, e podem ser identificados ao analizar o nome dos arquivos, eles possuem final ".unit.spec.ts". Todos os testes unítarios utilizam de repositórios em memória para executar suas verificações, esses repositórios podem ser encontrados dentro da pasta "test", na raiz da aplicação.

Já os testes E2E podem ser encontrados na parte de infra da aplicação, junto com os controllers dos endpoints que eles estão testando. Estes testes funcionam utilizando da infraestrutura real da aplicação, ou seja, elas utilizam bancos de dados SQLite. No caso do banco de dados, no ínicio dos testes é gerado um novo banco para que os dados sejam armazenados nele e este mesmo banco é apagado após cada um dos testes, criando um ambiente único e sem interferencias para cada teste.
