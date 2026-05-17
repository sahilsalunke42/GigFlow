import {Schema, model, Document} from 'mongoose';
import bcrypt from 'bcryptjs';

enum UserRole {
    Admin = 'admin',
    Sales = 'sales'
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}


const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: UserRole,
        default: UserRole.Sales
    }
}, {
    timestamps: true
});

// Hash the password before saving the user
userSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});


const User = model<IUser>('User', userSchema);

export default User;
