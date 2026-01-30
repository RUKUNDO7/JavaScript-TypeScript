import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const usersSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
    lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
    username: { type: String, required: true, minlength: 3, maxlength: 30, unique: true },
    age: { type: Number, required: true, min: 0 },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true, minlength: 8, maxlength: 128 }
});
usersSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
usersSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
const users = mongoose.model('users', usersSchema);
export default users;