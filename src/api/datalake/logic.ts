import jsonPatch from 'jsonpatch';
import dal from './dal.js';
import helper from '../../helper.js';
import { IODataParams } from "../../types";
import { DataObject } from "./data/type";

export default {
    async write(data: DataObject): Promise<DataObject> {
        return dal.write(data);
    },

    async get(q: IODataParams): Promise<DataObject[]> {
        const query = await helper.parseOdataQuery(q);
        return dal.get(query);
    },

    async getOne(id: string): Promise<DataObject> {
        return dal.getOne(id);
    },

    async patch(id: string, update: any[]): Promise<DataObject> {
        const d = await dal.getOne(id);
        const patched: DataObject = jsonPatch.apply_patch(JSON.parse(JSON.stringify(d)), update);
        return dal.patch(id, patched);
    }
};