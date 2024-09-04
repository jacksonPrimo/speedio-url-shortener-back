# url-shortener-back

## sobre o projeto :computer:

Este projeto tem como principal função servir de API para p projeto url-shortener-front

## Como executar o projeto :collision:
<ol>
  <li>
  Instale as dependencias do projeto:

```bash
  $ npm install
```
  </li>
  <li>
  Caso não tenha um banco de dados postgres local, roda o seguinte comando para criar um container no docker contendo uma instancia de um banco. Ele pega as instruções contidas no arquivo docker-compose.yml

```bash
  # Lembrando que antes você precisa instalar o docker e o docker-compose em sua maquina.
  # Se precisar de um painel para administrar o banco local, basta retirar os comentários do arquivo docker-compose.yml antes de executar o comando.
  # E por fim caso esteja usando o windows abra o Docker Desktop antes de executar o comando.
  $ docker-compose up
```
  </li>
  <li>
  Execute as migrations para que o banco de dados local fique atualizado.

```bash
  $ npm run migrate:dev
```
  </li>
  <li>
  Execute a aplicação em modo de desenvolvimento com hot reload:

```bash
  $ npm run start:dev
```
  </li>
  <li>
  Ou se preferir crie uma build do projeto e execute os arquivos de distribuição:

```bash
  # este comando irá gerar uma pasta dist e executará o arquivo main.js dentro da mesma.
  $ npm start
```
  </li>
</ol>


## lista de outros comandos :space_invader:

```bash

# rodar os testes unitários
$ npm run test
# rodar os testes unitários com hot reload:
$ npm run test:watch

# rodar os testes de integração usando cypress
$ npm run test:e2e
```

## Diretórios do projeto :file_folder:
Aqui estão alguns diretórios importantes para uma boa familiarização do projeto

### `dtos`

Este diretório contém arquivos com classes que indicam o formato que os dados devem ter ao longo do ciclo de vida dos processos da aplicação, como por exemplo o formato dos dados que devem vir nas requisições e que devem ir nas respostas.

### `guards`

Este diretório contém middlewares que impedem o acesso a determinado endpoint da api baseado em critérios de autenticação e tipo de usuário.

### `modules`

Este diretório abriga os modulos da aplicação, cada um contendo uma série de arquivos que vão desde a manipulação das requisições até o a comunicação com o banco de dados:

#### `.service`
responsável pela comunicação com o banco de dados.
#### `.controller`
responsável por manusear as requisições extraindo apenas o necessário de cada uma.
#### `.module`
responsável por 'envelopar' os demais arquivos e fazer a injeção de suas dependências. 

### `utils`

Este diretório contem arquivos com funções que normalmente abstraem taréfas repetivivas ao longo da aplicação, como a manipulação do accessToken.

## Documentação da api :blue_book:
Segue abaixo o link contendo a documentação da api feita com swagger:
https://speedio-url-shortener-back.herokuapp.com/doc/
