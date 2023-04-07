import {Schema, model, Document, Expression} from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DataObject } from './type';

const dataSchema = new Schema<DataObject>({
    created: {
        type: Date,
        default: Date.now,
        expires: '7d'
    },
    type: String,
    stream: String,
    subject: String,
    data: Object,
    _id: {
        type: String,
        default: uuid
    }
},{
    _id: false
});

dataSchema.pre('save', done => done());

dataSchema.virtual('id').get(function(){
    return String(this._id);
});

dataSchema.set('toJSON', {
    virtuals: true,
    transform: (doc: Document, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

// Export the Mongoose model
export default model<DataObject>('data-lake', dataSchema);