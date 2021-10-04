import express from 'express'
const app = express()
const port = 4000

app.use(express.urlencoded({extended: true})) //converte caracteres especiais em html entity
app.use(express.json()) // Fará o parse no conteúdo JSON
app.disable('x-powered-by') // Removendo por questões de segurança

import rotasVagas from './routes/vagas.js'

app.use('/api/vagas', rotasVagas)

app.get('/api', (req, res) => {
    res.status(200).json({
        mensagem: 'API da vagas 100% funcional',
        versao: '1.0.0'
    })
})

app.use('/', express.static('public'))

app.use(function(req, res) {
    res.status(404).json({
        mensagem: `A rota ${req.originalUrl} não existe!`
    })
})

app.listen(port, function() {
    console.log(`Servidor web rodando na porta ${port}`)
})