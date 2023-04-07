export default {
    schema: {
        "writeData": {
            "title": "writeDataObject",
            "type": "object",
            "properties": {
                "created": {
                    "type": "string"
                },
                "type": {
                    "type": "string",
                },
                "stream": {
                    "type": "string",
                },
                "subject": {
                    "type": "string",
                },
                "data": {
                    "type": "object"
                }
            }
        },
        "data": {
            "title": "dataObject",
            "type": "object",
            "allOf": [
                {
                    "$ref": "#/components/schemas/writeData"
                }
            ],
            "properties": {
                "id": {
                    "type": "string",
                    "format": "uuid"
                }
            }
        }
    }
}