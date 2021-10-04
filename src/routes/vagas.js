import express from 'express'
import sql from 'mssql'
import { sqlConfig } from '../sql/config.js' 
const router = express.Router()


/*****
 * GET /vagas
 * Retorna a lista de todos as vagas
 */
router.get("/", (req, res) => {
    try{
        sql.connect(sqlConfig).then(pool => {
            return pool.request()
            .execute('SP_S_VAG_VAGA')
        }).then(dados => {
            res.status(200).json(dados.recordset)
        }).catch(err => {
            res.status(400).json(err) //400 - Bad Request
        })
    }catch (err){
        console.error(err)
    }
})

/*****
 * GET /veiculos/:vaga
 * Retorna uma vaga através da codigo
 */
router.get("/:vaga", (req, res) => {
    const id = req.params.vaga
   try{
       sql.connect(sqlConfig).then(pool => {
           return pool.request()
           .input('id', sql.Int, id)
           .execute('SP_S_VAG_VAGA_CODIGO')
       }).then(dados => {
           res.status(200).json(dados.recordset)
       }).catch(err => {
           res.status(400).json(err) //400 - Bad Request
       })
   }catch (err){
       console.error(err)
   }
})

/*****
 * POST /vagas
 * Insere uma nova vagas
 */

 router.post("/", (req, res) => {
    sql.connect(sqlConfig).then(pool => {
        const {nomeVaga, descricao, nomeEmpresa, salario} = req.body
        return pool.request()
        .input('nomeVaga', sql.VarChar(100), nomeVaga)
        .input('descricao', sql.VarChar(100), descricao)
        .input('nomeEmpresa', sql.VarChar(100), nomeEmpresa)
        .input('salario', sql.Numeric, salario)
        .output('codigogerado', sql.Int)
        .execute('SP_I_VAG_VAGA')
    }).then(dados => {
        res.status(200).json(dados.output)
    }).catch(err => {
        res.status(400).json(err.message) //400 - Bad Request 
    })
})

/*****
 * PUT /vaga
 * Altera os dados de uma vava
 */
router.put("/", (req, res) => {
    sql.connect(sqlConfig).then(pool => {
        const {id, nomeVaga, descricao, nomeEmpresa, salario} = req.body
        return pool.request()
        .input('id', sql.Int, id)
        .input('nomeVaga', sql.VarChar(100), nomeVaga)
        .input('descricao', sql.VarChar(100), descricao)
        .input('nomeEmpresa', sql.VarChar(100), nomeEmpresa)
        .input('salario', sql.Numeric, salario)
        .execute('SP_U_VAG_VAGA')
    }).then(dados => {
        res.status(200).json("Vaga alterada com sucesso!")
    }).catch(err => {
        res.status(400).json(err.message) //400 - Bad Request 
    })
})

/*****
 * DELETE /veiculos
 * Apaga uma vaga pela id-codigo
 */
 router.delete('/:id', (req, res) => {
    sql.connect(sqlConfig).then(pool => {
        const id = req.params.id
        return pool.request()
        .input('id', sql.Int, id)
        .execute('SP_D_VAG_VAGA')
    }).then(dados => {
        res.status(200).json('Vaga excluída com sucesso')
    }).catch(err => {
        res.status(400).json(err.message)
    })
})


export default router