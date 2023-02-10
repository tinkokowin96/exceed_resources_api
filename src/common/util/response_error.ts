import { Response } from 'express';

export const responseError = (res: Response, error: any) => {
    if (error.status) {
        return res.status(error.status).send({ message: error.message });
    }

    switch (error.constructor.name) {
        case 'ValidationError':
            return res.status(400).send({ message: error.message });

        case 'MongoServerError':
            return res.status(400).send({ message: error.message });

        case 'TypeError':
            return res.status(400).send({ message: error.message });

        default:
            return res.status(500).send({ message: 'Something wrong in the server' });
    }
};
