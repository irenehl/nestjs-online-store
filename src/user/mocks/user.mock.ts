import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const userMock = {
    id: 1,
    email: 'danielalopez@ravn.co',
    name: 'Daniela',
    lastname: 'Lopez',
    username: 'irenehl',
    password: bcrypt.hashSync('pass123', 10),
    role: Role.CLIENT,
    recovery: null,
};

export const allUsersMock = [
    {
        id: 1,
        email: 'danielalopez@ravn.co',
        name: 'Daniela',
        lastname: 'Huezo',
        username: 'daniela1',
        role: Role.CLIENT,
        password: 'pass123',
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-01'),
        recovery: null,
    },
    {
        id: 2,
        email: 'danielalopez+1@ravn.co',
        name: 'Daniela',
        lastname: 'Huezo',
        username: 'daniela2',
        role: Role.CLIENT,
        password: 'pass123',
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-01'),
        recovery: null,
    },
];

export const updatedUserMock = {
    id: 1,
    email: 'danielalopez@ravn.co',
    name: 'Daniela',
    lastname: 'Lopez',
    username: 'daniela',
    password: bcrypt.hashSync('pass123', 10),
    role: Role.CLIENT,
    recovery: null,
};
