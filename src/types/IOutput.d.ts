export interface IResponseOutput {
    statusCode: number,
    type?: string,
    count?: number,
    data?: string | object,
    error?: any,
    message?: string
}