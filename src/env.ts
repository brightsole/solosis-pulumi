export default () => ({
  tableName: process.env.TABLE_NAME || 'ABJECT_FAILURE',
  region: process.env.REGION || 'ap-southeast-2',
  token: process.env.TOKEN,
});
