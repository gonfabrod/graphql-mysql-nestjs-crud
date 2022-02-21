import {GraphQLSchema, GraphQLObjectType} from 'graphql'
import {GREETING} from './Query/Greeting'
import {CREATE_USER, DELETE_USER, UPDATE_USER} from './Mutations/User'
import {GET_ALL_USERS, GET_USER} from './Query/Users'


const RootQuery= new GraphQLObjectType({
    name:'RootQuery',
    fields: {
        greetings: GREETING,
        getAllUsers: GET_ALL_USERS,
        getuser: GET_USER
    },
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields : {
        creatUser: CREATE_USER,
        deleteUser: DELETE_USER,
        updateUser: UPDATE_USER 
    },
});


export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation, 
    
})