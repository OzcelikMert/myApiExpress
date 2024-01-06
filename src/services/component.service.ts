import * as mongoose from "mongoose";
import MongoDBHelpers from "../library/mongodb/helpers";
import { Config } from "../config";
import {
    ComponentAddParamDocument,
    ComponentGetResultDocument,
    ComponentGetOneParamDocument,
    ComponentGetManyParamDocument,
    ComponentUpdateOneParamDocument,
    ComponentDeleteManyParamDocument
} from "../types/services/component";
import componentModel from "../models/component.model";
import Variable from "../library/variable";
import componentObjectIdKeys from "../constants/objectIdKeys/component.objectIdKeys";
import { ComponentDocument } from "../types/models/component";

export default {
    async getOne(params: ComponentGetOneParamDocument) {
        let filters: mongoose.FilterQuery<ComponentDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, componentObjectIdKeys);
        let defaultLangId = MongoDBHelpers.createObjectId(Config.defaultLangId);

        if (params._id) filters = {
            ...filters,
            _id: params._id
        }
        if (params.elementId) filters = {
            ...filters,
            elementId: params.elementId
        }

        let query = componentModel.findOne(filters).populate<{ authorId: ComponentGetResultDocument["authorId"], lastAuthorId: ComponentGetResultDocument["lastAuthorId"] }>({
            path: [
                "authorId",
                "lastAuthorId"
            ].join(" "),
            select: "_id name url"
        })

        query.sort({ createdAt: -1 });

        let doc = (await query.lean().exec()) as ComponentGetResultDocument | null;

        if (doc) {
            for (let docType of doc.types) {
                if (Array.isArray(docType.contents)) {
                    docType.contents = docType.contents.findSingle("langId", params.langId) ?? docType.contents.findSingle("langId", defaultLangId);
                }
            }
        }

        return doc;
    },
    async getMany(params: ComponentGetManyParamDocument) {
        let filters: mongoose.FilterQuery<ComponentDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, componentObjectIdKeys);
        let defaultLangId = MongoDBHelpers.createObjectId(Config.defaultLangId);

        if (params._id) filters = {
            ...filters,
            _id: params._id
        }

        if (params.elementId) filters = {
            ...filters,
            elementId: { $in: params.elementId }
        }

        let query = componentModel.find(filters).populate<{ authorId: ComponentGetResultDocument["authorId"], lastAuthorId: ComponentGetResultDocument["lastAuthorId"] }>({
            path: [
                "authorId",
                "lastAuthorId"
            ].join(" "),
            select: "_id name url"
        })

        query.sort({ createdAt: -1 });

        return (await query.lean().exec()).map((doc: ComponentGetResultDocument) => {
            for (let docType of doc.types) {
                if (Array.isArray(docType.contents)) {
                    docType.contents = docType.contents.findSingle("langId", params.langId) ?? docType.contents.findSingle("langId", defaultLangId);
                    if (docType.contents) {
                        delete docType.contents.content;
                    }
                }
            }

            return doc;
        });
    },
    async add(params: ComponentAddParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, componentObjectIdKeys);

        return await componentModel.create(params)
    },
    async updateOne(params: ComponentUpdateOneParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, componentObjectIdKeys);

        let filters: mongoose.FilterQuery<ComponentDocument> = {}

        if (params._id) {
            filters = {
                _id: params._id
            };
        }

        let doc = (await componentModel.findOne(filters).exec());

        if (doc) {
            if (params.types) {
                // Check delete
                doc.types = doc.types.filter(docType => params.types && params.types.indexOfKey("_id", docType._id) > -1)
                // Check Update
                for (let paramThemeGroupType of params.types) {
                    let docThemeGroupType = doc.types.findSingle("_id", paramThemeGroupType._id);
                    if (docThemeGroupType && Array.isArray(docThemeGroupType.contents)) {
                        let docGroupTypeContent = docThemeGroupType.contents.findSingle("langId", paramThemeGroupType.contents.langId);
                        if (docGroupTypeContent) {
                            docGroupTypeContent = Object.assign(docGroupTypeContent, paramThemeGroupType.contents);
                        } else {
                            docThemeGroupType.contents.push(paramThemeGroupType.contents)
                        }
                        docThemeGroupType = Object.assign(docThemeGroupType, {
                            ...paramThemeGroupType,
                            contents: docThemeGroupType.contents,
                            _id: docThemeGroupType._id
                        })
                    } else {
                        doc.types.push({
                            ...paramThemeGroupType,
                            contents: [paramThemeGroupType.contents]
                        })
                    }
                }
                delete params.types;
            }

            doc = Object.assign(doc, params);

            await doc.save();
        }

        return { _id: doc?._id }
    },
    async deleteMany(params: ComponentDeleteManyParamDocument) {
        let filters: mongoose.FilterQuery<ComponentDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, componentObjectIdKeys);

        filters = {
            ...filters,
            _id: { $in: params._id }
        }

        return (await componentModel.deleteMany(filters).exec()).deletedCount;
    }
};