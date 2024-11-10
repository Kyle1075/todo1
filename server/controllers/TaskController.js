import { emptyOrRows } from "../helpers/utils.js";
//Create TaskController.js in the controllers folder. This file will import selectAllTasks function from model and will call it to return data to set status and return value as JSON. Try-catch block will catch errors, also ones occurring on model. In case there is an error, it will be forwarded to the middleware defined in index.js.
import {selectAllTasks,insertTask} from '../models/Task.js';
const getTasks = async (req, res, next) => {
    try {
        const result = await selectAllTasks();
        return res.status(200).json(emptyOrRows(result));
    } catch (error) {
        return next(error);
    }
}
const postTask = async (req, res, next) => {
    try{
        if(!req.body.description ||req.body.description.length===0){
            const error = new Error('Invalid description for task');
            error.status = 400;
            return next(error);
        }
        const result = await insertTask(req.body.description);
        return res.status(200).json({id: result.rows[0].id});
    }catch(error){
        return next(error);
    }
}
export {getTasks,postTask};

