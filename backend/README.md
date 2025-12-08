# Backend - Gestão PPI

Acesse o diretório:
```bash
cd backend
```

## Configurando ambiente

Instale as dependências:
```bash
npm ci
```

 Copie e ajuste variáveis de ambiente:
```bash
cp .example.env .env
# editar .env conforme necessário (DATABASE_URL, AUTH_SECRET, NEXTAUTH_SECRET, ...)
```

Inicie o container do docker:
```bash
docker compose up
```

Em seguida, execute as migrações do Prisma:
```bash
npm run migrate
```

## Testes

Inicie a aplicação em modo de desenvolvimento:
```bash
npm run start:dev
```

Em desenvolvimento, no momento de inicializar a aplicação pela primeira vez, é criado no banco de dados o usuário root. 
Suas credenciais são:
```json
{
    "registration": "000000",
    "password": "root123"
}
```

### Teste Unitário

Execute os testes:
```bash
npm run test:unit
```

## Gerar imagem Docker
```bash
docker build -t gestao-ppi-backend .
```