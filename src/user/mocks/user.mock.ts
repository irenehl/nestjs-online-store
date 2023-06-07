import { Roles } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export default {
    id: 1,
    email: 'danielalopez@ravn.co',
    name: 'Daniela',
    lastname: 'Lopez',
    username: 'irenehl',
    password: bcrypt.hashSync('pass123', 10),
    role: Roles.CLIENT,
    recovery: null,
};
