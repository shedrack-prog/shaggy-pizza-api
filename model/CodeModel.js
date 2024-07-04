import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
const CodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  user: {
    required: true,
    type: ObjectId,
    ref: 'User',
  },
});
const Code = mongoose.models.Code || mongoose.model('Code', CodeSchema);
export default Code;
