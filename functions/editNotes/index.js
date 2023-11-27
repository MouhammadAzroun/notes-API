const AWS = require('aws-sdk');
const { sendResponse } = require('../../responses');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    const { id } = event.pathParameters;
    const updatedNote = JSON.parse(event.body);

    if (!id) {
        return sendResponse(400, { success: false, error: 'Note ID is required.' });
    }

    if (!updatedNote.title && !updatedNote.text) {
        return sendResponse(400, { success: false, error: 'At least one of title or text is required for editing.' });
    }

    const now = new Date().toISOString();

    try {
        const existingNote = await db.get({
            TableName: 'notes-db',
            Key: {
                id,
            },
        }).promise();

        if (!existingNote.Item) {
            return sendResponse(404, { success: false, error: 'Note not found.' });
        }

        const updatedItem = {
            ...existingNote.Item,
            title: updatedNote.title || existingNote.Item.title,
            text: updatedNote.text || existingNote.Item.text,
            modifiedAt: now,
        };

        await db.put({
            TableName: 'notes-db',
            Item: updatedItem,
        }).promise();

        return sendResponse(200, { success: true, note: updatedItem });
    } catch (error) {
        console.error('Error editing note in DynamoDB:', error);
        return sendResponse(500, { success: false, error: 'Internal server error.' });
    }
};
