# Upload de arquivos com Multer

Passo a passo para implementar um sistema de upload de imagens em um site utilizando a biblioteca Multer.

---

## Passo a passo

### 1. Configurações iniciais e criação do cluster

* Clone o repositório base para o Visual Studio Code.
* Em seguida, para fazer a instalação das dependências, execute os comandos no terminal:
    ```
    npm i dotenv express mongoose multer
    ```
    
    ```
    npm i -D nodemon
    ```
    
    ```
    npm i -g nodemon
    ```
    
* Crie um cluster do MongoDb (utilizamos o [Atlas](https://www.freecodecamp.org/news/get-started-with-mongodb-atlas)).
* Acesse o arquivo `.env` e altere as variáveis de ambiente DB_USER e DB_PASS de acordo com o usuário e a senha do cluster previamente criado.
 
    ```
    DB_USER = seuuser
    DB_PASS = suasenha
    ```
    
* Por fim, crie uma pasta uploads na raiz do diretório. Você pode fazer isso inserindo este comando no terminal:
  
    ```
    mkdir uploads
    ```

### 2. Inserção da URI do Cluster

* Abra o arquivo [db.js](db.js) e descomente a seguinte seção do código:

    ```js
    async function main() {
        await mongoose.connect();

        console.log("Conectado com sucesso!");
    }
    ```

* Coloque a URI no código como demonstrado abaixo (não esqueça das crases). Substitua a parte do usuário e da senha, respectivamente, pelas variáveis de ambiente definidas anteriormente:

    ```js
    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}resto da URI`)
    ```

### 3. Upload de imagens

* Acesse [multer.js](config/multer.js) e identifique a seção do código que se encontra comentada:

    ```js
    const storage = multer.diskStorage({
        destination: function(req,res, cb) {
            cb();
        },                   
        filename: function(req, file, cb) {
            cb();
        },
    });
    ```

* Descomente a seção e ajuste o código conforme seja pedido.
* Na primeira função callback, para `destination`, insira:

    ```js
    cb(null, "uploads/");
    ```

* Na segunda função callback, para `filename`, insira:

    ```js
    cb(null, Date.now() + path.extname(file.originalname));
    ```

* Mais abaixo no código, se encontra a variável `upload`, indefinida no momento. Portanto, vamos definir a variável como:

    ```js
    const upload = multer({ storage });
    ```

* Agora podemos mudar para o arquivo [app.js](app.js), e descomentar esta parte do código:

    ```js
    app.use('/uploads', express.static('uploads'));
    ```

### 4. Rota para as imagens

* No arquivo [image.js](routes/image.js), descomente esta seção do código e altere conforme instruído. Observe que, em ambas as rotas, estaremos utilizando [imageController](controller/imageController.js).

    ```js
    router.post();
    router.get();
    ```

* Na rota POST, vamos utilizar uma função específica do multer, `upload.single`, para lidar com somente uma única foto enviada pelo cliente. Insira:

    ```js
    router.post("/", upload.single("foto"), ImageController.create);
    ```

* Na rota GET, insira:

    ```js
    router.get("/", ImageController.getAll);
    ```

* Por fim, voltamos ao arquivo [app.js](app.js), e descomentamos a seguinte seção do código:

    ```js
    const imageRouter = require("./routes/image");
    app.use("/images", imageRouter);
    ```

### 5. Teste do site

* Execute o comando no terminal e acesse o endereço `localhost:4000` pelo navegador:

    ```
    npm run start
    ```

* Teste o site e aproveite!
* (Mediante quaisquer dúvidas, não se esqueça de perguntar!)


