import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { createSchema } from "../../utils/createSchema";

type Options = {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  userId?: number;
};
let schema: GraphQLSchema;

export const graphqlCall = async ({
  source,
  variableValues,
  userId,
}: Options) => {
  if (!schema) {
    schema = await createSchema();
  }
  return graphql({
    schema: await createSchema(),
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          userId,
        },
      },
      res: {
        clearCookie: jest.fn(),
      },
    },
  });
};
