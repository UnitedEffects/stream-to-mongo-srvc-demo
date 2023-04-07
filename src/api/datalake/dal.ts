import Data from './data/model.js';
import { IMongoQuery } from "../../types";
import {DataObject} from "./data/type";

export default {
    async write(data: DataObject): Promise<any> {
        const d = new Data(data);
        return d.save();
    },
    async get(query: IMongoQuery): Promise<any> {
        return Data.find(query.query).select(query.projection).sort(query.sort).skip(query.skip).limit(query.limit);
    },
    async getOne(id: string): Promise<any> {
        return Data.findOne( { _id: id });
    },
    async patch(id: string, data: DataObject): Promise<any> {
        return Data.findOneAndUpdate({ _id: id }, data, { new: true, overwrite: true })
    }
};