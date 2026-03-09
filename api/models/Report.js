import mongoose from 'mongoose';
const reportSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        category: { type: String, enum: ['intelligence', 'logistics', 'alert'], required: true },
        urgency: { type: String, enum: ['low', 'medium', 'high'], required: true },
        message: { type: String, required: true },
        imagePath: { type: String },
        sourceType: { type: String, enum: ['form', 'csv'], required: true }
    },
    { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
