export const registerMutation = `
  mutation Register($options: RegisterInput!) {
    register(options: $options) {
      user {
        id
        email
        name
      }
      errors {
        field
        message
      }
    }
  }
`;
export const loginQuery = `
mutation Login($options: LoginInput!) {
  login(options: $options) {
    user {
      id
      email
      name
    }
    errors {
      field
      message
    }
  }
}
`

export const meQuery = `
  query {
    me {
      id
      name
      email
    }
  }
`;

