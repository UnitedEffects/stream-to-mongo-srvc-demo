export interface DataObject {
    id?: string;
    _id?: string;
    created?: string|number;
    stream: string|undefined,
    subject: string,
    type: string
    data: {
        [k: string]: unknown;
    }
}