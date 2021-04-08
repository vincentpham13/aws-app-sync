import { AppSyncClient, CreateFunctionInput, CreateFunctionCommand } from '@aws-sdk/client-appsync-node';
import { fromIni } from '@aws-sdk/credential-provider-ini';

async function executor() {
  try {
    const appSync = new AppSyncClient({
      credentials: fromIni(),
    });

    const params: CreateFunctionInput = {
      apiId: 'pazltyadm5d2dbv2exr5d6oqam',
      name: 'findOneEvent',
      description: 'FindOneEvent function return a single event',
      dataSourceName: 'AppSyncEventTable',
      requestMappingTemplate: `{
        "operation": "GetItem",
        "key": {
          "id": $util.dynamodb.toDynamoDBJson($ctx.args.id),
        }
      }`,
      functionVersion: '2018-05-29',
      responseMappingTemplate: `
        #if($ctx.error)
            $util.error($ctx.error.message, $ctx.error.type)
        #end
        $util.toJson($ctx.result)
      `
    }

    const createFunctionsCommand = new CreateFunctionCommand(params);

    const createdFunction = await appSync.send(createFunctionsCommand);
    console.log("🚀 ~ file: main.ts ~ line 35 ~ executor ~ createdFunction", createdFunction)
  } catch (error) {
    console.log("🚀 ~ file: main.ts ~ line 18 ~ executor ~ error", error);
  }
}

executor();