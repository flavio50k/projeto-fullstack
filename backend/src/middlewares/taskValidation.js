const Joi = require('joi');

// Define o esquema de validação
const taskSchema = Joi.object({
    // Validação para o campo 'title'
    title: Joi.string().required().min(3).messages({
        'any.required': 'O campo "title" é obrigatório.',
        'string.empty': 'O campo "title" não pode ser vazio.',
        'string.min': 'O campo "title" deve ter pelo menos 3 caracteres.',
        'string.base': 'O campo "title" deve ser um texto.'
    }),
    // 'completed' é opcional no POST/PUT, mas se for enviado, deve ser um boolean
    completed: Joi.boolean().optional()
}).required();

// Middleware que executa a validação
const validateBody = (req, res, next) => {
    const isPut = req.method === 'PUT';

    // Esquema Base para POST (title obrigatório, completed opcional)
    let schema = Joi.object({
        title: Joi.string().required().min(3).messages({
            'any.required': 'O campo "title" é obrigatório.',
            'string.empty': 'O campo "title" não pode ser vazio.',
            'string.min': 'O campo "title" deve ter pelo menos 3 caracteres.'
        }),
        completed: Joi.boolean().optional()
    });

    if (isPut) {
        // Esquema para PUT (PATCH like): Todos os campos são opcionais, 
        // mas se forem fornecidos, devem seguir as regras de formato.
        schema = Joi.object({
            title: Joi.string().min(3).messages({
                'string.empty': 'O campo "title" não pode ser vazio na atualização.',
                'string.min': 'O campo "title" deve ter pelo menos 3 caracteres.'
            }),
            completed: Joi.boolean()
            // Adiciona .min(1) para garantir que pelo menos UM campo seja enviado na requisição PUT
        }).min(1).messages({
            'object.min': 'Pelo menos um dos campos ("title" ou "completed") deve ser fornecido para atualização.'
        });
    }

    const { error } = schema.validate(req.body);

    if (error) {
        // Retorna o erro 400 (Bad Request)
        return res.status(400).json({
            message: error.details[0].message.replace(/"/g, '')
        });
    }

    next();
};

module.exports = {
    validateBody,
};