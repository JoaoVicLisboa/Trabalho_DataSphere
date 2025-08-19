const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const db = new sqlite3.Database('./database.db');
const PORT = 3000;
const SECRET_KEY = 81D0406A4A670875D0DD9F22253FE96E18A20683FA6230C7DFCD601B;

app.use(bodyParser.json());

// Middleware de autenticação
function authenticateToken(req, res, next) {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Login Route
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    // Verifica se é Chefe
    db.get('SELECT ID, Usuario, Senha FROM Chefe WHERE Usuario = ?', [usuario], (err, chefe) => {
        if (err) return res.status(500).json({ error: err.message });

        if (chefe) {
            if (senha === chefe.Senha) {
                const token = jwt.sign({ id: chefe.ID, role: 'chefe' }, SECRET_KEY);
                return res.json({ token });
            } else {
                return res.status(401).json({ error: 'Senha incorreta' });
            }
        } else {
            // Verifica se é Supervisor
            db.get('SELECT ID, Usuario, Senha, Setor FROM Supervisor WHERE Usuario = ?', [usuario], (err, supervisor) => {
                if (err) return res.status(500).json({ error: err.message });

                if (supervisor) {
                    if (senha === supervisor.Senha) {
                        const token = jwt.sign({ id: supervisor.ID, role: 'supervisor', setor: supervisor.Setor }, SECRET_KEY);
                        return res.json({ token });
                    } else {
                        return res.status(401).json({ error: 'Senha incorreta' });
                    }
                } else {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
            });
        }
    });
});


// Route to get all employees (chefe)
app.get('/funcionarios', authenticateToken, (req, res) => {
    if (req.user.role === 'chefe') {
        db.all('SELECT * FROM Funcionario', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    } else if (req.user.role === 'supervisor') {
        db.all('SELECT * FROM Funcionario WHERE SupervisorID = ?', [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    } else {
        res.status(403);
    }
});

// Rota para adicionar um funcionário
app.post('/funcionarios', authenticateToken, (req, res) => {
    const { nome, setor, cpf, email, sexo, cargaHoraria, tarefasConcluidas, salario, cargo } = req.body;

    if (req.user.role === 'chefe') {
        // Obter o ID do supervisor com base no setor fornecido
        db.get('SELECT ID FROM Supervisor WHERE Setor = ?', [setor], (err, supervisor) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!supervisor) {
                return res.status(404).json({ error: 'Não há supervisor para o setor fornecido' });
            }
            const supervisorID = supervisor.ID;
            db.run('INSERT INTO Funcionario (Nome, Setor, CPF, Email, Sexo, CargaHoraria, TarefasConcluidas, Salario, Cargo, SupervisorID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [nome, setor, cpf, email, sexo, cargaHoraria, tarefasConcluidas, salario, cargo, supervisorID], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ id: this.lastID });
            });
        });
    } else if (req.user.role === 'supervisor') {
        // Verificar se o setor do funcionário corresponde ao setor do supervisor
        if (setor !== req.user.setor) {
            return res.status(403).json({ error: 'O setor do funcionário deve corresponder ao setor do supervisor' });
        }
        // Obter o ID do supervisor que está fazendo a solicitação
        const supervisorID = req.user.id;
        db.run('INSERT INTO Funcionario (Nome, Setor, CPF, Email, Sexo, CargaHoraria, TarefasConcluidas, Salario, Cargo, SupervisorID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [nome, setor, cpf, email, sexo, cargaHoraria, tarefasConcluidas, salario, cargo, supervisorID], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
        });
    } else {
        res.status(403);
    }
});
app.post('/', (req, res) => {
    console.log('Servidor online');
    res.send('Servidor online');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

