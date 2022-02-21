import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLObjectType, GraphQLString } from "graphql";
import {Users} from '../../Entities/Users'
import {UserType} from '../Typedef/Users'
import bcrypt from 'bcryptjs'
import {MessageType} from '../Typedef/message'


export const CREATE_USER ={
    type: UserType,
    args: {
        name: {type: GraphQLString},
        username: {type: GraphQLString},
        password: {type: GraphQLString}
    },
    async resolve(_:any, args: any){
        
        const {name,username, password} = args;

       const encryptPassword  = await bcrypt.hash(password, 10)

        const result = await Users.insert({
            name:name,
            username : username,
            password: encryptPassword
        });

        console.log(result);

        return{...args, id: result.identifiers[0].id, password:encryptPassword};

    }   
    
};

export const DELETE_USER = {
    type: GraphQLBoolean,
    arg : {
        id: { type: GraphQLID}
    },
    async resolve(_: any, {id}: any){
        const result = await Users.delete(id);
        if (result.affected === 1) return true;
        return false
    }
};

export const UPDATE_USER = {
    type: MessageType,
    args: {
        id: {type: GraphQLString},
        input:{
            type: new GraphQLInputObjectType({
                name: "UserInput",
                fields: {
                    name: {type: GraphQLString},
                    username: {type: GraphQLString},
                    oldPassword: {type: GraphQLString},
                    newPassword: {type: GraphQLString},
                },
            }),
        },
        
    },
    async resolve (_: any, {id, input}: any){
        const userfound= await Users.findOne(id);

        if (!userfound) return{
            success: false,
            message: "User not found"
        }

        const isMatch = await bcrypt.compare(input.oldpassword,userfound.password)

        if(!isMatch) return {
            success: false,
            message: "Old password es incorrect"
        };

        const newpasswordhash = await bcrypt.hash(input.newPassword,10);
        
        const result = await Users.update({id},{
             name: input.name, 
             username: input.username, 
             password: newpasswordhash});
       
        if (result.affected === 0) return false;
        return {
            success: true,
            message: "User updated successfully",
        };
    }
}