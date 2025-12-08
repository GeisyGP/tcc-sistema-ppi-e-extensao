# Frontend - Gestão PPI

Acesse o diretório:
```bash
cd frontend
```

## Configurando ambiente

Instale as dependências:
```bash
$ npm ci
```

 Copie e ajuste variáveis de ambiente:
```bash
cp .example.env .env
# editar .env conforme necessário
```

## Testes

Inicie a aplicação em modo de desenvolvimento:
```bash
npm run dev
```

Em desenvolvimento, no momento de inicializar a aplicação pela primeira vez, é criado no banco de dados o usuário root. 
Suas credenciais são:
```json
{
    "registration": "000000",
    "password": "root123"
}
```

## Gerar imagem Docker
```bash
docker build -t gestao-ppi-frontend .
```