# 1STi-backend-test

Existem alguns arquivos de docker-compose para facilitar. Um para desenvolvimento, testes e um exemplo para produção.
Além disso possui os arquivos .env de exemplo.

---

Para rodar o projeto em ambiente de desenvolvimento:
```
$ docker-compose up -d
$ npm i
$ npx prisma migrate dev
$ npm run dev
```

---

Para rodar os teste é necessário limpar o docker-compose anterior:
```
$ docker-compose down
$ npm test
```

O script de test faz o seguinte:
- Inicializa o ambiente de testes com o compose
- Roda as migrações do prisma
- Roda os testes usando Jest
- Limpa o ambiente de testes

Caso algum teste falhe, é possível rodar novamente usando o seguinte comando:
``` 
$ npm run test:retry
```

---

Para inicializar o ambiente de produção:
```
$ docker-compose -f docker-compose.prod.yml up
```
