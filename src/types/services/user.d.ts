import mongoose from "mongoose";
import {UserDocument} from "../models/user";

export interface UserPopulateDocument {
    _id: mongoose.Types.ObjectId | string
    name: string,
    url: string,
    image: string
}

export type UserGetResultDocument = {
    isOnline?: boolean
} & UserDocument

export interface UserGetOneParamDocument {
    _id?: string
    email?: string
    password?: string
    statusId?: number
    url?: string
    roleId?: number
    ignoreUserId?: string[]
}

export interface UserGetManyParamDocument {
    _id?: string[]
    statusId?: number
    email?: string,
    count?: number,
    page?: number
    roleId?: number
    ignoreUserId?: string[]
}

export type UserAddParamDocument = {
    password: string
} & Omit<UserDocument, "_id"|"password">

export type UserUpdateOneParamDocument = {
    _id: string
    roleId?: number
    statusId?: number
    name?: string
    email?: string
    permissions?: number[]
} & Omit<UserDocument, "_id"|"roleId"|"statusId"|"name"|"email"|"permissions">

export type UserDeleteOneParamDocument = {
    _id: string
}