// FIXME: うまくいかないので一旦スルー https://github.com/shelfio/jest-dynamodb#22-examples
// import yaml from 'js-yaml';
// import fs from 'fs/promises';
// import schema from 'cloudformation-js-yaml-schema';

// module.exports = async () => {
//   const file = await fs.readFile('./dynamodb/create-table.yml', 'utf8');
//   const cf = yaml.load(file, { schema: schema });
//   cf.TableName = `${cf.TableName}_Test`;
//   const tables = [cf];

//   return {
//     tables,
//     port: 8000,
//   };
// };

module.exports = {
  tables: [
    {
      TableName: 'Todos_Test',
      AttributeDefinitions: [
        { AttributeName: 'ID', AttributeType: 'S' },
        { AttributeName: 'Title', AttributeType: 'S' },
        { AttributeName: 'Description', AttributeType: 'S' },
        { AttributeName: 'DueDate', AttributeType: 'S' },
        { AttributeName: 'Status', AttributeType: 'S' },
      ],
      KeySchema: [{ AttributeName: 'ID', KeyType: 'HASH' }],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'TitleIndex',
          KeySchema: [
            { AttributeName: 'Title', KeyType: 'HASH' },
            { AttributeName: 'Status', KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'KEYS_ONLY' },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
        {
          IndexName: 'DescriptionIndex',
          KeySchema: [
            { AttributeName: 'Description', KeyType: 'HASH' },
            { AttributeName: 'Status', KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'KEYS_ONLY' },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
        {
          IndexName: 'DueDateIndex',
          KeySchema: [
            { AttributeName: 'DueDate', KeyType: 'HASH' },
            { AttributeName: 'Status', KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'KEYS_ONLY' },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
        {
          IndexName: 'StatusIndex',
          KeySchema: [
            { AttributeName: 'Status', KeyType: 'HASH' },
            { AttributeName: 'ID', KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  ],
};
